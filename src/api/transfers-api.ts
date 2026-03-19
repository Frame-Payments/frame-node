import type { AxiosInstance } from 'axios';
import type { Transfer, TransferListResponse, CreateTransferParams } from '../types/transfers';
import { paginate } from '../utils/paginator';

export class TransfersAPI {
  constructor(private client: AxiosInstance) {}

  async list(per_page?: number, page?: number): Promise<TransferListResponse> {
    const resp = await this.client.get('/v1/transfers', { params: { per_page, page } });
    return resp.data;
  }

  async get(id: string): Promise<Transfer> {
    const resp = await this.client.get(`/v1/transfers/${id}`);
    return resp.data;
  }

  async create(params: CreateTransferParams): Promise<Transfer> {
    const resp = await this.client.post('/v1/transfers', params);
    return resp.data;
  }

  async iterateAllTransfers(per_page = 20) {
    return paginate<Transfer>(async (page: number) => {
      const res = await this.client.get('/v1/transfers', { params: { per_page, page } });
      return res.data;
    }, per_page);
  }
}
