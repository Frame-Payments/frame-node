import type { AxiosInstance } from 'axios';
import type {
    Subscription,
    SubscriptionListResponse,
    CreateSubscriptionParams,
    UpdateSubscriptionParams,
    SearchSubscriptionParams
} from '../types/subscriptions';
import { paginate } from '../utils/paginator';

export class SubscriptionsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateSubscriptionParams): Promise<Subscription> {
    const resp = await this.client.post('/v1/subscriptions', params);
    return resp.data;
  }

  async update(id: string, params: UpdateSubscriptionParams): Promise<Subscription> {
    const resp = await this.client.patch(`/v1/subscriptions/${id}`, params);
    return resp.data;
  }

  async get(id: string): Promise<Subscription> {
    const resp = await this.client.get(`/v1/subscriptions/${id}`);
    return resp.data;
  }

  async list(per_page?: number, page?: number): Promise<SubscriptionListResponse> {
    const resp = await this.client.get('/v1/subscriptions', { params: { per_page, page } });
    return resp.data;
  }

  async iterateAllSubscriptions(per_page = 20) {
        return paginate<Subscription>(async (page: number) => {
          const res = await this.client.get('/v1/subscriptions', {
            params: { per_page, page }
          });
          return res.data;
        }, per_page);
      }

  async search(query: SearchSubscriptionParams): Promise<SubscriptionListResponse> {
    const resp = await this.client.get('/v1/subscriptions/search', { params: query });
    return resp.data;
  }

  async cancel(id: string): Promise<Subscription> {
    const resp = await this.client.post(`/v1/subscriptions/${id}/cancel`);
    return resp.data;
  }
}