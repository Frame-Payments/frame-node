import type { AxiosInstance } from 'axios';
import type { Payout, CreatePayoutParams } from '../types/payouts';

export class PayoutsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreatePayoutParams): Promise<Payout> {
    const resp = await this.client.post('/v1/payouts', params);
    return resp.data;
  }
}
