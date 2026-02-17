import type { AxiosInstance } from 'axios';
import type { Capability, RequestCapabilitiesParams } from '../types/capabilities';

export class CapabilitiesAPI {
  constructor(private client: AxiosInstance) {}

  async list(accountId: string): Promise<Capability[]> {
    const resp = await this.client.get(`/v1/accounts/${accountId}/capabilities`);
    return resp.data;
  }

  async request(accountId: string, params: RequestCapabilitiesParams): Promise<Capability[]> {
    const resp = await this.client.post(`/v1/accounts/${accountId}/capabilities`, params);
    return resp.data;
  }

  async get(accountId: string, name: string): Promise<Capability> {
    const resp = await this.client.get(`/v1/accounts/${accountId}/capabilities/${name}`);
    return resp.data;
  }

  async disable(accountId: string, name: string): Promise<Capability> {
    const resp = await this.client.delete(`/v1/accounts/${accountId}/capabilities/${name}`);
    return resp.data;
  }
}
