import type { AxiosInstance } from 'axios';
import type { TermsOfServiceTokenResponse, UpdateTermsOfServiceParams } from '../types/terms_of_service';

export class TermsOfServiceAPI {
  constructor(private client: AxiosInstance) {}

  async createToken(): Promise<TermsOfServiceTokenResponse> {
    const resp = await this.client.post('/v1/terms_of_service', {});
    return resp.data;
  }

  async update(params: UpdateTermsOfServiceParams): Promise<TermsOfServiceTokenResponse> {
    const resp = await this.client.patch('/v1/terms_of_service', params);
    return resp.data;
  }
}
