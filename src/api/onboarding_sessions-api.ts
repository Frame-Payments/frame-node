import type { AxiosInstance } from 'axios';
import type {
  OnboardingSession,
  CreateOnboardingSessionParams,
  OnboardingSessionBootstrap,
} from '../types/onboarding_sessions';
import { maybePublishableKey, type RequestOptions } from '../client';

export class OnboardingSessionsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateOnboardingSessionParams, opts?: RequestOptions): Promise<OnboardingSession> {
    const resp = await this.client.post('/v1/onboarding_sessions', params, maybePublishableKey(opts));
    return resp.data;
  }

  async list(accountId: string, opts?: RequestOptions): Promise<OnboardingSession> {
    const resp = await this.client.get('/v1/onboarding_sessions', {
      ...maybePublishableKey(opts),
      params: { account_id: accountId },
    });
    return resp.data;
  }

  /** @deprecated Use `list` instead. Removed at v2. */
  async getByAccount(accountId: string, opts?: RequestOptions): Promise<OnboardingSession> {
    return this.list(accountId, opts);
  }

  // GET /v1/onboarding_sessions/bootstrap — bootstraps the embedded onboarding
  // Web Component from a client_secret. Authenticate with the onb_sess_* token
  // (an active onboarding session set via setOnboardingSession, or a per-request
  // authToken). Returns session metadata, the ordered step list, and full
  // account context in one call.
  async bootstrap(opts?: RequestOptions): Promise<OnboardingSessionBootstrap> {
    const resp = await this.client.get('/v1/onboarding_sessions/bootstrap', maybePublishableKey(opts));
    return resp.data;
  }
}
