import type { AxiosInstance } from 'axios';
import type {
  TransferFeePlan,
  TransferFeePlanListResponse,
  CreateTransferFeePlanParams
} from '../types/transfer_fee_plans';
import { paginate } from '../utils/paginator';

export class TransferFeePlansAPI {
  constructor(private client: AxiosInstance) {}

  async list(per_page?: number, page?: number): Promise<TransferFeePlanListResponse> {
    const resp = await this.client.get('/v1/transfer_fee_plans', { params: { per_page, page } });
    return resp.data;
  }

  async get(id: string): Promise<TransferFeePlan> {
    const resp = await this.client.get(`/v1/transfer_fee_plans/${id}`);
    return resp.data;
  }

  async create(params: CreateTransferFeePlanParams): Promise<TransferFeePlan> {
    const resp = await this.client.post('/v1/transfer_fee_plans', params);
    return resp.data;
  }

  async iterateAllTransferFeePlans(per_page = 20) {
    return paginate<TransferFeePlan>(async (page: number) => {
      const res = await this.client.get('/v1/transfer_fee_plans', { params: { per_page, page } });
      return res.data;
    }, per_page);
  }
}
