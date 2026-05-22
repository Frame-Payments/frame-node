import type { AxiosInstance } from 'axios';
import type { EvervaultConfiguration, SiftConfiguration } from '../types/configuration';
import { maybePublishableKey, type RequestOptions } from '../client';

export class ConfigurationAPI {
  constructor(private client: AxiosInstance) {}

  async getEvervaultConfiguration(opts?: RequestOptions): Promise<EvervaultConfiguration> {
    const resp = await this.client.get('/v1/config/evervault', maybePublishableKey(opts));
    return resp.data;
  }

  async getSiftConfiguration(opts?: RequestOptions): Promise<SiftConfiguration> {
    const resp = await this.client.get('/v1/config/sift', maybePublishableKey(opts));
    return resp.data;
  }
}
