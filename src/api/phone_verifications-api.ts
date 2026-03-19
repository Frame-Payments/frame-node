import type { AxiosInstance } from 'axios';
import type {
  PhoneVerification,
  CreatePhoneVerificationParams,
  ConfirmPhoneVerificationParams
} from '../types/phone_verifications';

export class PhoneVerificationsAPI {
  constructor(private client: AxiosInstance) {}

  async create(accountId: string, params: CreatePhoneVerificationParams): Promise<PhoneVerification> {
    const resp = await this.client.post(`/v1/accounts/${accountId}/phone_verifications`, params);
    return resp.data;
  }

  async confirm(accountId: string, id: string, params: ConfirmPhoneVerificationParams): Promise<PhoneVerification> {
    const resp = await this.client.post(`/v1/accounts/${accountId}/phone_verifications/${id}/confirm`, params);
    return resp.data;
  }
}
