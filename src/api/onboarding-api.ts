import type { AxiosInstance } from 'axios';
import type {
  OnboardingSession,
  OnboardingSessionListResponse,
  ListOnboardingSessionsParams,
  CreateOnboardingSessionParams,
  UpdateOnboardingSessionParams,
  OnboardingPayoutParams
} from '../types/onboarding';

export class OnboardingAPI {
  constructor(private client: AxiosInstance) {}

  async list(params?: ListOnboardingSessionsParams): Promise<OnboardingSessionListResponse> {
    const resp = await this.client.get('/v1/onboarding/sessions', { params });
    return resp.data;
  }

  async create(params: CreateOnboardingSessionParams): Promise<OnboardingSession> {
    const resp = await this.client.post('/v1/onboarding/sessions', params);
    return resp.data;
  }

  async retrieve(sessionId: string): Promise<OnboardingSession> {
    const resp = await this.client.get(`/v1/onboarding/sessions/${sessionId}`);
    return resp.data;
  }

  /** @deprecated Use `retrieve` instead. Removed at v2. */
  async get(sessionId: string): Promise<OnboardingSession> {
    return this.retrieve(sessionId);
  }

  async update(sessionId: string, params: UpdateOnboardingSessionParams): Promise<OnboardingSession> {
    const resp = await this.client.patch(`/v1/onboarding/sessions/${sessionId}`, params);
    return resp.data;
  }

  async payout(sessionId: string, params: OnboardingPayoutParams): Promise<OnboardingSession> {
    const resp = await this.client.post(`/v1/onboarding/sessions/${sessionId}/payout`, params);
    return resp.data;
  }
}
