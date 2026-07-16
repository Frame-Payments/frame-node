import type { AxiosInstance } from 'axios';
import type {
    PaymentMethod,
    PaymentMethodListResponse,
    CreateCardPaymentMethodParams,
    CreateACHPaymentMethodParams,
    UpdatePaymentMethodParams,
    ConnectPlaidParams,
    CreateApplePayPaymentMethodParams,
    CreateGooglePayPaymentMethodParams
} from '../types/payment_methods';
import { paginate } from '../utils/paginator';
import { maybePublishableKey, type RequestOptions } from '../client';

export class PaymentMethodsAPI {
  constructor(private client: AxiosInstance) {}

  async createCard(params: CreateCardPaymentMethodParams, opts?: RequestOptions): Promise<PaymentMethod> {
    const resp = await this.client.post('/v1/payment_methods', params, maybePublishableKey(opts));
    return resp.data;
  }

  async createACH(params: CreateACHPaymentMethodParams, opts?: RequestOptions): Promise<PaymentMethod> {
    const resp = await this.client.post('/v1/payment_methods', params, maybePublishableKey(opts));
    return resp.data;
  }

  async createApplePayPaymentMethod(
    params: CreateApplePayPaymentMethodParams,
    opts?: RequestOptions,
  ): Promise<PaymentMethod> {
    const resp = await this.client.post(
      '/v1/payment_methods',
      params,
      maybePublishableKey({ usePublishableKey: true, ...opts }),
    );
    return resp.data;
  }

  async createGooglePayPaymentMethod(
    params: CreateGooglePayPaymentMethodParams,
    opts?: RequestOptions,
  ): Promise<PaymentMethod> {
    const resp = await this.client.post(
      '/v1/payment_methods',
      params,
      maybePublishableKey({ usePublishableKey: true, ...opts }),
    );
    return resp.data;
  }

  async retrieve(id: string): Promise<PaymentMethod> {
    const resp = await this.client.get(`/v1/payment_methods/${id}`);
    return resp.data;
  }

  /** @deprecated Use `retrieve` instead. Removed at v2. */
  async get(id: string): Promise<PaymentMethod> {
    return this.retrieve(id);
  }

  async list(per_page?: number, page?: number): Promise<PaymentMethodListResponse> {
    const resp = await this.client.get('/v1/payment_methods', { params: { per_page, page } });
    return resp.data;
  }

  iterateAllPaymentMethods(per_page = 20): AsyncGenerator<PaymentMethod> {
    return paginate<PaymentMethod>(async (page: number) => {
      const res = await this.client.get('/v1/payment_methods', {
        params: { per_page, page }
      });
      return res.data;
    }, per_page);
  }

  async listForCustomer(customerId: string, per_page?: number, page?: number): Promise<PaymentMethodListResponse> {
    const resp = await this.client.get(`/v1/customers/${customerId}/payment_methods`, {
      params: { per_page, page }
    });
    return resp.data;
  }

  async update(id: string, params: UpdatePaymentMethodParams): Promise<PaymentMethod> {
    const resp = await this.client.patch(`/v1/payment_methods/${id}`, params);
    return resp.data;
  }

  async attach(id: string, customerId: string): Promise<PaymentMethod> {
    const resp = await this.client.post(`/v1/payment_methods/${id}/attach`, { customer: customerId });
    return resp.data;
  }

  async detach(id: string): Promise<PaymentMethod> {
    const resp = await this.client.post(`/v1/payment_methods/${id}/detach`);
    return resp.data;
  }

  async block(id: string): Promise<PaymentMethod> {
    const resp = await this.client.post(`/v1/payment_methods/${id}/block`);
    return resp.data;
  }

  async unblock(id: string): Promise<PaymentMethod> {
    const resp = await this.client.post(`/v1/payment_methods/${id}/unblock`);
    return resp.data;
  }

  async connectPlaid(params: ConnectPlaidParams, opts?: RequestOptions): Promise<PaymentMethod> {
    const resp = await this.client.post('/v1/payment_methods/connect_plaid', params, maybePublishableKey(opts));
    return resp.data;
  }

  async connectPlaidBankAccount(params: ConnectPlaidParams, opts?: RequestOptions): Promise<PaymentMethod> {
    return this.connectPlaid(params, opts);
  }
}
