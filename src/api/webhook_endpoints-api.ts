import type { AxiosInstance } from 'axios';
import type { WebhookEndpoint, WebhookEndpointListResponse } from '../types/webhook_endpoints';
import { paginate } from '../utils/paginator';

export class WebhookEndpointsAPI {
  constructor(private client: AxiosInstance) {}

  async list(per_page?: number, page?: number): Promise<WebhookEndpointListResponse> {
    const resp = await this.client.get('/v1/webhook_endpoints', { params: { per_page, page } });
    return resp.data;
  }

  async iterateAllWebhookEndpoints(per_page = 20) {
    return paginate<WebhookEndpoint>(async (page: number) => {
      const res = await this.client.get('/v1/webhook_endpoints', { params: { per_page, page } });
      return res.data;
    }, per_page);
  }
}
