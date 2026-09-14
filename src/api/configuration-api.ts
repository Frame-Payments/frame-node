import type { AxiosInstance } from 'axios';
import type {
  EvervaultConfiguration,
  SiftConfiguration,
  FingerprintConfiguration,
  LegalConfiguration,
  MapboxConfiguration,
  AllConfiguration,
} from '../types/configuration';
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

  async getFingerprintConfiguration(opts?: RequestOptions): Promise<FingerprintConfiguration> {
    const resp = await this.client.get('/v1/config/fingerprint', maybePublishableKey(opts));
    return resp.data;
  }

  async getLegalConfiguration(opts?: RequestOptions): Promise<LegalConfiguration> {
    const resp = await this.client.get('/v1/config/legal', maybePublishableKey(opts));
    return resp.data;
  }

  async getMapboxConfiguration(opts?: RequestOptions): Promise<MapboxConfiguration> {
    const resp = await this.client.get('/v1/config/mapbox', maybePublishableKey(opts));
    return resp.data;
  }

  // Aggregate of all five config blocks in one round-trip. Matches Frame-iOS's
  // `GET /v1/config/all` (FRA-6251). Each block is omitted, not nulled, when
  // that sub-service failed to resolve server-side.
  async getAllConfiguration(opts?: RequestOptions): Promise<AllConfiguration> {
    const resp = await this.client.get('/v1/config/all', maybePublishableKey(opts));
    return resp.data;
  }
}
