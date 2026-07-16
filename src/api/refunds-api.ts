import type { AxiosInstance } from 'axios';
import type { Refund, RefundListResponse, CreateRefundParams } from '../types/refunds';
import { paginate } from '../utils/paginator';

export class RefundsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateRefundParams): Promise<Refund> {
    const resp = await this.client.post('/v1/refunds', params);
    return resp.data;
  }

  async retrieve(id: string): Promise<Refund> {
    const resp = await this.client.get(`/v1/refunds/${id}`);
    return resp.data;
  }

  /** @deprecated Use `retrieve` instead. Removed at v2. */
  async get(id: string): Promise<Refund> {
    return this.retrieve(id);
  }

  async list(per_page?: number, page?: number): Promise<RefundListResponse> {
    const resp = await this.client.get('/v1/refunds', { params: { per_page, page } });
    return resp.data;
  }

  async iterateAllRefunds(per_page = 20) {
      return paginate<Refund>(async (page: number) => {
        const res = await this.client.get('/v1/refunds', {
          params: { per_page, page }
        });
        return res.data;
      }, per_page);
    }
}