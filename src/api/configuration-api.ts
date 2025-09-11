import type { AxiosInstance } from 'axios';
import type {
    GetEvervaultConfigurationResponse,
} from '../types/configuration';

export class ConfigurationAPI {
  constructor(private client: AxiosInstance) {}

  async get(): Promise<GetEvervaultConfigurationResponse> {
    const resp = await this.client.get(`/v1/config/evervault`);
    return resp.data;
  }
}