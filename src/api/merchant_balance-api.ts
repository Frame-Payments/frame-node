import type { AxiosInstance } from 'axios';
import type { MerchantBalance } from '../types/merchant_balance';
import { maybePublishableKey, type RequestOptions } from '../client';

export class MerchantBalanceAPI {
  constructor(private client: AxiosInstance) {}

  // GET /v1/merchant_balance — top-level singleton, no id. Returns the current
  // balance for the authenticated merchant.
  async retrieve(opts?: RequestOptions): Promise<MerchantBalance> {
    const resp = await this.client.get('/v1/merchant_balance', maybePublishableKey(opts));
    return resp.data;
  }
}
