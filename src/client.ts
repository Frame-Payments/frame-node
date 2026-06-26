import axios, { AxiosHeaders } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { FrameAPIError } from './errors/frame_api_error';

export interface ClientConfig {
  apiKey?: string;
  publishableKey?: string;
  // Override the API base URL. Defaults to https://api.framepayments.com.
  // Useful for pointing local development at a self-hosted Frame OS instance
  // (e.g. http://api.framepayments.test via puma-dev).
  baseURL?: string;
  // Headers to attach to every request from this client. Used by the React
  // Native SDK to forward the device IP via `ip_address` on each call (matches
  // the native Frame iOS / Frame Android behavior). The request interceptor
  // applies these *before* setting Authorization, so callers cannot use this
  // hook to override key routing.
  defaultHeaders?: Record<string, string>;
}

export interface RequestOptions {
  usePublishableKey?: boolean;
  // Per-request bearer override (e.g. an object `client_secret` such as
  // `ci_..._secret_...`). When present, it wins over both an active onboarding
  // session token and the configured pk_/sk_ keys. Mirrors the per-call
  // `client_secret` tier of the native iOS/Android auth resolvers.
  authToken?: string;
}

// Internal auth routing is carried on the axios request *config* (not on
// headers). Axios passes unknown config fields straight through to the request
// interceptor untouched and never serializes them onto the wire, so a secret
// `frameAuthToken` can never leak as an HTTP header and there is nothing to
// strip before the request leaves the process. Callers cannot reach these
// fields through the public helpers' header path, so a raw header named like
// the old smuggle keys can no longer override key routing.
interface FrameRequestConfig extends AxiosRequestConfig {
  frameUsePublishableKey?: boolean;
  frameAuthToken?: string;
}
const FRAME_USE_PUBLISHABLE_KEY = 'frameUsePublishableKey';
const FRAME_AUTH_TOKEN = 'frameAuthToken';

// Holds the active onboarding-session bearer token (e.g. `onb_sess_...`). The
// request interceptor closes over a single instance of this so the token can be
// set/cleared on the live client after construction, mirroring the native iOS
// `beginOnboardingSession`/`endOnboardingSession` model. A mutable holder (vs.
// recreating the client) keeps every already-wired API class pointed at the
// same auth state.
export interface OnboardingSessionStore {
  token: string | null;
}

export const createOnboardingSessionStore = (): OnboardingSessionStore => ({ token: null });

// Strips the Authorization header and the per-request `frameAuthToken` (an
// object client_secret) before stashing axios's error config on
// FrameAPIError.raw — without this, every network-layer failure would leak the
// live Bearer token / client_secret to anyone logging the error.
function safeRawFromAxiosError(err: any): unknown {
  if (!err || typeof err !== 'object') return err;
  const cleanedConfig = err.config
    ? (() => {
        const {
          headers,
          [FRAME_AUTH_TOKEN]: _authToken,
          ...restConfig
        } = err.config as { headers?: unknown } & Record<string, unknown>;
        const cleanedHeaders =
          headers && typeof headers === 'object'
            ? Object.fromEntries(
                Object.entries(headers as Record<string, unknown>).filter(
                  ([k]) => k.toLowerCase() !== 'authorization',
                ),
              )
            : headers;
        return { ...restConfig, headers: cleanedHeaders };
      })()
    : undefined;
  return {
    message: err.message,
    code: err.code,
    name: err.name,
    config: cleanedConfig,
  };
}

export const createApiClient = (
  config: ClientConfig,
  sessionStore: OnboardingSessionStore = createOnboardingSessionStore(),
): AxiosInstance => {
  const { apiKey, publishableKey, defaultHeaders } = config;

  if (!apiKey && !publishableKey) {
    throw new Error(
      'FrameSDK config requires at least one of: apiKey, publishableKey. ' +
        'Mobile clients should ship publishableKey only; server code should use apiKey.',
    );
  }

  const baseURL = config.baseURL ?? 'https://api.framepayments.com';

  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use((requestConfig: InternalAxiosRequestConfig) => {
    const headers = requestConfig.headers;
    const cfg = requestConfig as FrameRequestConfig;
    const wantsPublishable = cfg.frameUsePublishableKey === true;
    // An explicitly-provided but empty authToken is a caller bug (e.g. an
    // unpopulated client_secret). Fail loudly rather than silently fall through
    // to the session/pk/sk bearer, which would send the request under a
    // broader-privilege credential than intended.
    const rawAuthToken = cfg.frameAuthToken;
    if (rawAuthToken === '') {
      throw new FrameAPIError(
        'Frame authToken was provided but empty. Pass a non-empty client_secret (e.g. ci_..._secret_...), or omit authToken to use the configured key.',
        'invalid_auth_token',
        0,
        null,
      );
    }
    const perRequestAuthToken =
      typeof rawAuthToken === 'string' && rawAuthToken.length > 0 ? rawAuthToken : undefined;

    if (defaultHeaders) {
      for (const [name, value] of Object.entries(defaultHeaders)) {
        if (value == null) continue;
        if (headers instanceof AxiosHeaders) {
          if (!headers.has(name)) headers.set(name, value);
        } else if (headers) {
          const h = headers as Record<string, string>;
          if (h[name] === undefined) h[name] = value;
        }
      }
    }

    // Resolve the bearer with the same three-tier precedence as the native
    // iOS/Android `bearerToken()`:
    //   1. per-request authToken (an object client_secret), else
    //   2. active onboarding-session token, else
    //   3. publishableKey when usePublishableKey === true, else apiKey.
    const sessionToken = sessionStore.token;
    let bearer: string | undefined;
    if (perRequestAuthToken) {
      bearer = perRequestAuthToken;
    } else if (sessionToken) {
      bearer = sessionToken;
    } else {
      const keyToUse = wantsPublishable ? publishableKey : apiKey;
      if (!keyToUse) {
        throw new FrameAPIError(
          wantsPublishable
            ? 'Frame publishable key is not configured. Pass { publishableKey } to new FrameSDK(...) before calling endpoints with { usePublishableKey: true }.'
            : 'Frame API key is not configured. Pass { apiKey } to new FrameSDK(...) before calling secret-keyed endpoints.',
          wantsPublishable ? 'missing_publishable_key' : 'missing_api_key',
          0,
          null,
        );
      }
      bearer = keyToUse;
    }
    if (headers instanceof AxiosHeaders) {
      headers.set('Authorization', `Bearer ${bearer}`);
    } else if (headers) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${bearer}`;
    }
    return requestConfig;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error instanceof FrameAPIError) {
        throw error;
      }
      if (error.response) {
        const { status, data } = error.response;
        const code = data?.code || 'unknown_error';
        const message = data?.message || 'An error occurred';
        throw new FrameAPIError(message, code, status, data);
      }
      throw new FrameAPIError(error.message, 'network_error', 0, safeRawFromAxiosError(error));
    },
  );

  return client;
};

// Translates RequestOptions into the internal axios *config* fields the request
// interceptor reads (frameUsePublishableKey / frameAuthToken). These never
// become wire headers, so the per-request client_secret can't leak and a raw
// caller-supplied header can't spoof key routing. `publishableDefault` differs
// between the two public helpers (withPublishableKey opts in by default,
// maybePublishableKey opts out).
function buildRequestConfig(
  publishableDefault: boolean,
  opts?: RequestOptions & AxiosRequestConfig,
): AxiosRequestConfig {
  const { usePublishableKey = publishableDefault, authToken, ...rest } = opts ?? {};
  const cfg: FrameRequestConfig = { ...rest };
  if (usePublishableKey) cfg[FRAME_USE_PUBLISHABLE_KEY] = true;
  // Pass authToken through verbatim (including '') so the interceptor — the
  // single chokepoint that always runs — can reject an empty value loudly.
  if (authToken !== undefined) cfg[FRAME_AUTH_TOKEN] = authToken;
  return cfg;
}

export function withPublishableKey(opts?: RequestOptions & AxiosRequestConfig): AxiosRequestConfig {
  return buildRequestConfig(true, opts);
}

export function maybePublishableKey(opts?: RequestOptions & AxiosRequestConfig): AxiosRequestConfig {
  return buildRequestConfig(false, opts);
}
