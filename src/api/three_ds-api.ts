import type { AxiosInstance } from 'axios';
import type { ThreeDSIntent, CreateThreeDSIntentParams } from '../types/three_ds';

export class ThreeDSAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateThreeDSIntentParams): Promise<ThreeDSIntent> {
    const resp = await this.client.post('/v1/3ds/intents', params);
    return resp.data;
  }

  async get(id: string): Promise<ThreeDSIntent> {
    const resp = await this.client.get(`/v1/3ds/intents/${id}`);
    return resp.data;
  }

  async resend(id: string): Promise<ThreeDSIntent> {
    const resp = await this.client.post(`/v1/3ds/intents/${id}/resend`);
    return resp.data;
  }
}
