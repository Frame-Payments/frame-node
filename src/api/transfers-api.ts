import type { AxiosInstance } from 'axios';
import type {
  ApproveTransferParams,
  CreateTransferParams,
  FraudDeclineParams,
  Transfer,
  TransferListResponse,
} from '../types/transfers';
import { paginate } from '../utils/paginator';
import { maybePublishableKey, type RequestOptions } from '../client';

export class TransfersAPI {
  constructor(private client: AxiosInstance) {}

  async list(per_page?: number, page?: number): Promise<TransferListResponse> {
    const resp = await this.client.get('/v1/transfers', { params: { per_page, page } });
    return resp.data;
  }

  async retrieve(id: string): Promise<Transfer> {
    const resp = await this.client.get(`/v1/transfers/${id}`);
    return resp.data;
  }

  /** @deprecated Use `retrieve` instead. Removed at v2. */
  async get(id: string): Promise<Transfer> {
    return this.retrieve(id);
  }

  async create(params: CreateTransferParams, opts?: RequestOptions): Promise<Transfer> {
    const resp = await this.client.post('/v1/transfers', params, maybePublishableKey(opts));
    return resp.data;
  }

  async confirm(id: string, opts?: RequestOptions): Promise<Transfer> {
    const resp = await this.client.post(`/v1/transfers/${id}/confirm`, undefined, maybePublishableKey(opts));
    return resp.data;
  }

  async approve(id: string, params: ApproveTransferParams, opts?: RequestOptions): Promise<Transfer> {
    const resp = await this.client.post(`/v1/transfers/${id}/approve`, params, maybePublishableKey(opts));
    return resp.data;
  }

  async fraud_decline(id: string, params: FraudDeclineParams, opts?: RequestOptions): Promise<Transfer> {
    const resp = await this.client.post(`/v1/transfers/${id}/fraud_decline`, params, maybePublishableKey(opts));
    return resp.data;
  }

  async iterateAllTransfers(per_page = 20) {
    return paginate<Transfer>(async (page: number) => {
      const res = await this.client.get('/v1/transfers', { params: { per_page, page } });
      return res.data;
    }, per_page);
  }
}
