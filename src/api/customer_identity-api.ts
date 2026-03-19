import type { AxiosInstance } from 'axios';
import type {
    CustomerIdentityVerification,
    CreateCustomerIdentityVerificationParams,
    UploadDocumentsParams
} from '../types/customer_identity';

export class CustomerIdentityVerificationsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateCustomerIdentityVerificationParams): Promise<CustomerIdentityVerification> {
    const resp = await this.client.post('/v1/customer_identity_verifications', params);
    return resp.data;
  }

  async get(id: string): Promise<CustomerIdentityVerification> {
    const resp = await this.client.get(`/v1/customer_identity_verifications/${id}`);
    return resp.data;
  }

  async uploadDocuments(id: string, params: UploadDocumentsParams): Promise<CustomerIdentityVerification> {
    const resp = await this.client.post(`/v1/customer_identity_verifications/${id}/upload_documents`, params);
    return resp.data;
  }
}