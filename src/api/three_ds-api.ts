import type { AxiosInstance } from 'axios';
import type { ThreeDSIntent, CreateThreeDSIntentParams } from '../types/three_ds';
import { maybePublishableKey, type RequestOptions } from '../client';

// Canonical resource base is `threeDsIntents` (see CROSS_SDK_NAMING.md — `DS`
// is in the acronym registry). `ThreeDSAPI` is retained as a deprecated alias
// export below for backward compatibility; both wrap the same `/v1/3ds/intents`
// surface.
export class ThreeDsIntentsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateThreeDSIntentParams, opts?: RequestOptions): Promise<ThreeDSIntent> {
    const resp = await this.client.post('/v1/3ds/intents', params, maybePublishableKey(opts));
    return resp.data;
  }

  async retrieve(id: string, opts?: RequestOptions): Promise<ThreeDSIntent> {
    const resp = await this.client.get(`/v1/3ds/intents/${id}`, maybePublishableKey(opts));
    return resp.data;
  }

  /** @deprecated Use `retrieve` instead. Removed at v2. */
  async get(id: string, opts?: RequestOptions): Promise<ThreeDSIntent> {
    return this.retrieve(id, opts);
  }

  async resend(id: string, opts?: RequestOptions): Promise<ThreeDSIntent> {
    const resp = await this.client.post(`/v1/3ds/intents/${id}/resend`, undefined, maybePublishableKey(opts));
    return resp.data;
  }
}

/** @deprecated Use `ThreeDsIntentsAPI` (canonical `threeDsIntents`). Removed at v2. */
export const ThreeDSAPI = ThreeDsIntentsAPI;
export type ThreeDSAPI = ThreeDsIntentsAPI;
