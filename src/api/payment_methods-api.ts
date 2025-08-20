import type { AxiosInstance } from 'axios';
import type {
    PaymentMethod,
    PaymentMethodListResponse,
    CreatePaymentMethodParams,
    UpdatePaymentMethodParams
} from '../types/payment_methods';

export class PaymentMethodsAPI {
  constructor(private client: AxiosInstance) {}

  // Create
  async create(params: CreatePaymentMethodParams): Promise<PaymentMethod> {
    const resp = await this.client.post('/v1/payment_methods', params);
    return resp.data;
  }

  // Retrieve
  async get(id: string): Promise<PaymentMethod> {
    const resp = await this.client.get(`/v1/payment_methods/${id}`);
    return resp.data;
  }

  // List
  async list(per_page?: number, page?: number): Promise<PaymentMethodListResponse> {
    const resp = await this.client.get('/v1/payment_methods', { params: { per_page, page } });
    return resp.data;
  }

  // Retrieve for customer
  async listForCustomer(customerId: string, per_page?: number, page?: number): Promise<PaymentMethodListResponse> {
    const resp = await this.client.get(`/v1/customers/${customerId}/payment_methods`, {
      params: { per_page, page }
    });
    return resp.data;
  }

  // Update
  async update(id: string, params: UpdatePaymentMethodParams): Promise<PaymentMethod> {
    const resp = await this.client.patch(`/v1/payment_methods/${id}`, params);
    return resp.data;
  }

  // Attach to customer
  async attach(id: string, customerId: string): Promise<PaymentMethod> {
    const resp = await this.client.post(`/v1/payment_methods/${id}/attach`, { customer: customerId });
    return resp.data;
  }

  // Detach from customer
  async detach(id: string): Promise<PaymentMethod> {
    const resp = await this.client.post(`/v1/payment_methods/${id}/detach`);
    return resp.data;
  }

  // Block
  async block(id: string): Promise<PaymentMethod> {
    const resp = await this.client.post(`/v1/payment_methods/${id}/block`);
    return resp.data;
  }

  // Unblock
  async unblock(id: string): Promise<PaymentMethod> {
    const resp = await this.client.post(`/v1/payment_methods/${id}/unblock`);
    return resp.data;
  }
}