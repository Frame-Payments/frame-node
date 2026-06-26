import type { AxiosInstance } from 'axios';
import type { OnboardingSession, CreateOnboardingSessionParams } from '../types/onboarding_sessions';
import { maybePublishableKey, type RequestOptions } from '../client';

export class OnboardingSessionsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateOnboardingSessionParams, opts?: RequestOptions): Promise<OnboardingSession> {
    const resp = await this.client.post('/v1/onboarding_sessions', params, maybePublishableKey(opts));
    return resp.data;
  }

  async getByAccount(accountId: string, opts?: RequestOptions): Promise<OnboardingSession> {
    const resp = await this.client.get('/v1/onboarding_sessions', {
      ...maybePublishableKey(opts),
      params: { account_id: accountId },
    });
    return resp.data;
  }
}
