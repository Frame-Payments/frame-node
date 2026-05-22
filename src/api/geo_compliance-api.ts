import type { AxiosInstance } from 'axios';
import type { GeoComplianceStatus } from '../types/geo_compliance';
import { maybePublishableKey, type RequestOptions } from '../client';

export class GeoComplianceAPI {
  constructor(private client: AxiosInstance) {}

  async getAccountStatus(accountId: string, opts?: RequestOptions): Promise<GeoComplianceStatus> {
    const resp = await this.client.get(
      `/v1/accounts/${accountId}/geo_compliance`,
      maybePublishableKey(opts),
    );
    return resp.data;
  }
}
