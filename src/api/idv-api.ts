import type { AxiosInstance } from 'axios';
import type {
  CreateIdvSessionResponse,
  CompleteIdvSessionResponse,
} from '../types/idv';
import { maybePublishableKey, type RequestOptions } from '../client';

export class IdvAPI {
  constructor(private client: AxiosInstance) {}

  async createSession(opts?: RequestOptions): Promise<CreateIdvSessionResponse> {
    const resp = await this.client.post('/v1/idv/session', undefined, maybePublishableKey(opts));
    return resp.data;
  }

  async completeSession(inquiryId: string, opts?: RequestOptions): Promise<CompleteIdvSessionResponse> {
    const resp = await this.client.post(
      '/v1/idv/complete',
      { inquiry_id: inquiryId },
      maybePublishableKey(opts),
    );
    return resp.data;
  }
}
