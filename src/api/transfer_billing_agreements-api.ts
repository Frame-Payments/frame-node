import type { AxiosInstance } from 'axios';
import type {
  TransferBillingAgreement,
  TransferBillingAgreementListResponse,
  CreateTransferBillingAgreementParams,
  UpdateTransferBillingAgreementParams
} from '../types/transfer_billing_agreements';
import { paginate } from '../utils/paginator';

export class TransferBillingAgreementsAPI {
  constructor(private client: AxiosInstance) {}

  async list(per_page?: number, page?: number): Promise<TransferBillingAgreementListResponse> {
    const resp = await this.client.get('/v1/transfer_billing_agreements', { params: { per_page, page } });
    return resp.data;
  }

  async get(id: string): Promise<TransferBillingAgreement> {
    const resp = await this.client.get(`/v1/transfer_billing_agreements/${id}`);
    return resp.data;
  }

  async create(params: CreateTransferBillingAgreementParams): Promise<TransferBillingAgreement> {
    const resp = await this.client.post('/v1/transfer_billing_agreements', params);
    return resp.data;
  }

  async update(id: string, params: UpdateTransferBillingAgreementParams): Promise<TransferBillingAgreement> {
    const resp = await this.client.patch(`/v1/transfer_billing_agreements/${id}`, params);
    return resp.data;
  }

  async iterateAllTransferBillingAgreements(per_page = 20) {
    return paginate<TransferBillingAgreement>(async (page: number) => {
      const res = await this.client.get('/v1/transfer_billing_agreements', { params: { per_page, page } });
      return res.data;
    }, per_page);
  }
}
