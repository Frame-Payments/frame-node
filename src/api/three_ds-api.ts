import type { AxiosInstance } from 'axios';
import type { ThreeDSIntent, CreateThreeDSIntentParams } from '../types/three_ds';
import { maybePublishableKey, type RequestOptions } from '../client';

export class ThreeDSAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateThreeDSIntentParams, opts?: RequestOptions): Promise<ThreeDSIntent> {
    const resp = await this.client.post('/v1/3ds/intents', params, maybePublishableKey(opts));
    return resp.data;
  }

  async get(id: string, opts?: RequestOptions): Promise<ThreeDSIntent> {
    const resp = await this.client.get(`/v1/3ds/intents/${id}`, maybePublishableKey(opts));
    return resp.data;
  }

  async resend(id: string, opts?: RequestOptions): Promise<ThreeDSIntent> {
    const resp = await this.client.post(`/v1/3ds/intents/${id}/resend`, undefined, maybePublishableKey(opts));
    return resp.data;
  }
}
