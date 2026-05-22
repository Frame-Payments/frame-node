import type { AxiosInstance } from 'axios';
import type {
  AttestRequest,
  AttestResponse,
  ChallengeResponse,
} from '../types/device_attestation';
import { withPublishableKey, type RequestOptions } from '../client';

export class DeviceAttestationAPI {
  constructor(private client: AxiosInstance) {}

  async getChallenge(opts?: RequestOptions): Promise<ChallengeResponse> {
    const resp = await this.client.post('/v1/client/device_attestation/challenge', undefined, withPublishableKey(opts));
    return resp.data;
  }

  async attest(params: AttestRequest, opts?: RequestOptions): Promise<AttestResponse> {
    const resp = await this.client.post('/v1/client/device_attestation/attest', params, withPublishableKey(opts));
    return resp.data;
  }
}
