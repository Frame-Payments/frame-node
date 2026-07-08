import type { AxiosInstance } from 'axios';
import type {
  WebhookEndpoint,
  WebhookEndpointListResponse,
  CreateWebhookEndpointParams,
  UpdateWebhookEndpointParams,
  DeletedWebhookEndpoint,
} from '../types/webhook_endpoints';
import { paginate } from '../utils/paginator';

export class WebhookEndpointsAPI {
  constructor(private client: AxiosInstance) {}

  async list(per_page?: number, page?: number): Promise<WebhookEndpointListResponse> {
    const resp = await this.client.get('/v1/webhook_endpoints', { params: { per_page, page } });
    return resp.data;
  }

  // The response includes the signing `secret` — surface it to the merchant
  // once. It is not returned again on retrieve/list; rotate to obtain a new one.
  async create(params: CreateWebhookEndpointParams): Promise<WebhookEndpoint> {
    const resp = await this.client.post('/v1/webhook_endpoints', params);
    return resp.data;
  }

  async retrieve(id: string): Promise<WebhookEndpoint> {
    const resp = await this.client.get(`/v1/webhook_endpoints/${id}`);
    return resp.data;
  }

  async update(id: string, params: UpdateWebhookEndpointParams): Promise<WebhookEndpoint> {
    const resp = await this.client.patch(`/v1/webhook_endpoints/${id}`, params);
    return resp.data;
  }

  async delete(id: string): Promise<DeletedWebhookEndpoint> {
    const resp = await this.client.delete(`/v1/webhook_endpoints/${id}`);
    return resp.data;
  }

  // Rotates the signing secret and returns the endpoint with the new `secret`.
  // The previous secret is immediately invalidated.
  async rotateSecret(id: string): Promise<WebhookEndpoint> {
    const resp = await this.client.post(`/v1/webhook_endpoints/${id}/rotate_secret`);
    return resp.data;
  }

  async iterateAllWebhookEndpoints(per_page = 20) {
    return paginate<WebhookEndpoint>(async (page: number) => {
      const res = await this.client.get('/v1/webhook_endpoints', { params: { per_page, page } });
      return res.data;
    }, per_page);
  }
}
