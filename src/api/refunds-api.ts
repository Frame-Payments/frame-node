import type { AxiosInstance } from 'axios';
import type { Refund, RefundListResponse, CreateRefundParams } from '../types/refunds';

export class RefundsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateRefundParams): Promise<Refund> {
    const resp = await this.client.post('/v1/refunds', params);
    return resp.data;
  }

  async get(id: string): Promise<Refund> {
    const resp = await this.client.get(`/v1/refunds/${id}`);
    return resp.data;
  }

  async list(per_page?: number, page?: number): Promise<RefundListResponse> {
    const resp = await this.client.get('/v1/refunds', { params: { per_page, page } });
    return resp.data;
  }

  async cancel(id: string): Promise<Refund> {
    const resp = await this.client.post(`/v1/refunds/${id}/cancel`);
    return resp.data;
  }
}