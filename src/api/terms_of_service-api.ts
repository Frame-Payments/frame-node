import type { AxiosInstance } from 'axios';
import type { TermsOfServiceTokenResponse, UpdateTermsOfServiceParams } from '../types/terms_of_service';
import { maybePublishableKey, type RequestOptions } from '../client';

export class TermsOfServiceAPI {
  constructor(private client: AxiosInstance) {}

  async createToken(opts?: RequestOptions): Promise<TermsOfServiceTokenResponse> {
    const resp = await this.client.post('/v1/terms_of_service', {}, maybePublishableKey(opts));
    return resp.data;
  }

  async update(params: UpdateTermsOfServiceParams): Promise<TermsOfServiceTokenResponse> {
    const resp = await this.client.patch('/v1/terms_of_service', params);
    return resp.data;
  }
}
