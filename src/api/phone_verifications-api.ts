import type { AxiosInstance } from 'axios';
import type {
  PhoneVerification,
  CreatePhoneVerificationParams,
  ConfirmPhoneVerificationParams
} from '../types/phone_verifications';
import { maybePublishableKey, type RequestOptions } from '../client';

export class PhoneVerificationsAPI {
  constructor(private client: AxiosInstance) {}

  async create(
    accountId: string,
    params: CreatePhoneVerificationParams,
    opts?: RequestOptions,
  ): Promise<PhoneVerification> {
    const resp = await this.client.post(
      `/v1/accounts/${accountId}/phone_verifications`,
      params,
      maybePublishableKey(opts),
    );
    return resp.data;
  }

  async confirm(
    accountId: string,
    id: string,
    params: ConfirmPhoneVerificationParams,
    opts?: RequestOptions,
  ): Promise<PhoneVerification> {
    const resp = await this.client.post(
      `/v1/accounts/${accountId}/phone_verifications/${id}/confirm`,
      params,
      maybePublishableKey(opts),
    );
    return resp.data;
  }
}
