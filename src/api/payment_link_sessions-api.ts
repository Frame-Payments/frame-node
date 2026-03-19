import type { AxiosInstance } from 'axios';
import type {
  PaymentLinkSession,
  CreatePaymentLinkSessionParams
} from '../types/payment_link_sessions';

export class PaymentLinkSessionsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreatePaymentLinkSessionParams): Promise<PaymentLinkSession> {
    const resp = await this.client.post('/v1/payment_link_sessions', params);
    return resp.data;
  }
}
