import type { AxiosInstance } from 'axios';
import type {
  SubscriptionChangeLog,
  SubscriptionChangeLogListResponse
} from '../types/subscription_change_logs';
import { paginate } from '../utils/paginator';

export class SubscriptionChangeLogsAPI {
  constructor(private client: AxiosInstance) {}

  async list(subscriptionId: string, per_page?: number, page?: number): Promise<SubscriptionChangeLogListResponse> {
    const resp = await this.client.get(`/v1/subscriptions/${subscriptionId}/change_logs`, { params: { per_page, page } });
    return resp.data;
  }

  async iterateAllSubscriptionChangeLogs(subscriptionId: string, per_page = 20) {
    return paginate<SubscriptionChangeLog>(async (page: number) => {
      const res = await this.client.get(`/v1/subscriptions/${subscriptionId}/change_logs`, { params: { per_page, page } });
      return res.data;
    }, per_page);
  }
}
