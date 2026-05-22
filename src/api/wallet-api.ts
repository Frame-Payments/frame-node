import type { AxiosInstance } from 'axios';
import type { GooglePayConfiguration } from '../types/wallet';
import { withPublishableKey, type RequestOptions } from '../client';

export class WalletAPI {
  constructor(private client: AxiosInstance) {}

  async getGooglePayConfiguration(opts?: RequestOptions): Promise<GooglePayConfiguration> {
    const resp = await this.client.get('/v1/client/wallet/google_pay', withPublishableKey(opts));
    return resp.data;
  }
}
