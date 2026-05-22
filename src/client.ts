import axios, { AxiosHeaders } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { FrameAPIError } from './errors/frame_api_error';

export interface ClientConfig {
  apiKey?: string;
  publishableKey?: string;
}

export interface RequestOptions {
  usePublishableKey?: boolean;
}

const PUBLISHABLE_FLAG_KEY = 'X-Frame-Use-Publishable-Key';

// Strips the Authorization header before stashing axios's error config on
// FrameAPIError.raw — without this, every network-layer failure would leak
// the live Bearer token to anyone logging the error.
function safeRawFromAxiosError(err: any): unknown {
  if (!err || typeof err !== 'object') return err;
  const cleanedConfig = err.config
    ? (() => {
        const { headers, ...restConfig } = err.config as { headers?: unknown } & Record<string, unknown>;
        const cleanedHeaders =
          headers && typeof headers === 'object'
            ? Object.fromEntries(
                Object.entries(headers as Record<string, unknown>).filter(
                  ([k]) => k.toLowerCase() !== 'authorization' && k !== PUBLISHABLE_FLAG_KEY,
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

export const createApiClient = (config: ClientConfig): AxiosInstance => {
  const { apiKey, publishableKey } = config;

  if (!apiKey && !publishableKey) {
    throw new Error(
      'FrameSDK config requires at least one of: apiKey, publishableKey. ' +
        'Mobile clients should ship publishableKey only; server code should use apiKey.',
    );
  }

  const baseURL = 'https://api.framepayments.com';

  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use((requestConfig: InternalAxiosRequestConfig) => {
    const headers = requestConfig.headers;
    const wantsPublishable = headers instanceof AxiosHeaders
      ? headers.has(PUBLISHABLE_FLAG_KEY)
      : Boolean((headers as Record<string, unknown> | undefined)?.[PUBLISHABLE_FLAG_KEY]);

    if (headers instanceof AxiosHeaders) {
      headers.delete(PUBLISHABLE_FLAG_KEY);
    } else if (headers && PUBLISHABLE_FLAG_KEY in (headers as Record<string, unknown>)) {
      delete (headers as Record<string, unknown>)[PUBLISHABLE_FLAG_KEY];
    }

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
    if (headers instanceof AxiosHeaders) {
      headers.set('Authorization', `Bearer ${keyToUse}`);
    } else if (headers) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${keyToUse}`;
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

export function withPublishableKey(opts?: RequestOptions & AxiosRequestConfig): AxiosRequestConfig {
  const { usePublishableKey = true, headers, ...rest } = opts ?? {};
  if (!usePublishableKey) {
    return headers ? { ...rest, headers } : { ...rest };
  }
  return {
    ...rest,
    headers: { ...(headers ?? {}), [PUBLISHABLE_FLAG_KEY]: '1' },
  };
}

export function maybePublishableKey(opts?: RequestOptions & AxiosRequestConfig): AxiosRequestConfig {
  const { usePublishableKey = false, headers, ...rest } = opts ?? {};
  if (!usePublishableKey) {
    return headers ? { ...rest, headers } : { ...rest };
  }
  return {
    ...rest,
    headers: { ...(headers ?? {}), [PUBLISHABLE_FLAG_KEY]: '1' },
  };
}
