import type { AxiosInstance } from 'axios';
import type {
    SubscriptionPhase,
    SubscriptionPhaseListResponse,
    CreateSubscriptionPhaseParams,
    UpdateSubscriptionPhaseParams
} from '../types/subscription_phases';
import { paginate } from '../utils/paginator';

export class SubscriptionPhasesAPI {
  constructor(private client: AxiosInstance) {}

  async list(subscriptionId: string): Promise<SubscriptionPhaseListResponse> {
    const resp = await this.client.get(`/v1/subscriptions/${subscriptionId}/phases`);
    return resp.data;
  }

  async iterateAllSubscriptionPhases(subscriptionId: string, per_page = 20) {
          return paginate<SubscriptionPhase>(async (page: number) => {
            const res = await this.client.get(`/v1/subscriptions/${subscriptionId}/phases`, {
              params: { per_page, page }
            });
            return res.data;
          }, per_page);
        }

  async get(subscriptionId: string, phaseId: string): Promise<SubscriptionPhase> {
    const resp = await this.client.get(`/v1/subscriptions/${subscriptionId}/phases/${phaseId}`);
    return resp.data;
  }

  async create(subscriptionId: string, params: CreateSubscriptionPhaseParams): Promise<SubscriptionPhase> {
    const resp = await this.client.post(`/v1/subscriptions/${subscriptionId}/phases`, params);
    return resp.data;
  }

  async update(subscriptionId: string, phaseId: string, params: UpdateSubscriptionPhaseParams): Promise<SubscriptionPhase> {
    const resp = await this.client.patch(`/v1/subscriptions/${subscriptionId}/phases/${phaseId}`, params);
    return resp.data;
  }

  async delete(subscriptionId: string, phaseId: string): Promise<{ id: string; object: string; deleted: boolean }> {
    const resp = await this.client.delete(`/v1/subscriptions/${subscriptionId}/phases/${phaseId}`);
    return resp.data;
  }

  async bulkUpdate(subscriptionId: string, phases: Array<{ id: string; [key: string]: any }>): Promise<SubscriptionPhaseListResponse> {
    const resp = await this.client.patch(`/v1/subscriptions/${subscriptionId}/phases/bulk_update`, { phases });
    return resp.data;
  }
}