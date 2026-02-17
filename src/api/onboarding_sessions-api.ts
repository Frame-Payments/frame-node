import type { AxiosInstance } from 'axios';
import type { OnboardingSession, CreateOnboardingSessionParams } from '../types/onboarding_sessions';

export class OnboardingSessionsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateOnboardingSessionParams): Promise<OnboardingSession> {
    const resp = await this.client.post('/v1/onboarding_sessions', params);
    return resp.data;
  }

  async getByAccount(accountId: string): Promise<OnboardingSession> {
    const resp = await this.client.get('/v1/onboarding_sessions', {
      params: { account_id: accountId }
    });
    return resp.data;
  }
}
