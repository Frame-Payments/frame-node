import type { AxiosInstance } from 'axios';
import { paginate } from '../utils/paginator';
import type {
    Customer,
    CustomerListResponse,
    CreateCustomerParams,
    UpdateCustomerParams,
    DeleteResponse,
    SearchCustomerParams
} from '../types/customers';
import type { PaymentMethod } from '../types/payment_methods';

export class CustomersAPI {
  constructor(private client: AxiosInstance) {}

  // Create
  async create(params: CreateCustomerParams): Promise<Customer> {
    const resp = await this.client.post('/v1/customers', params);
    return resp.data;
  }

  // Update
  async update(id: string, params: UpdateCustomerParams): Promise<Customer> {
    const resp = await this.client.patch(`/v1/customers/${id}`, params);
    return resp.data;
  }

  // Retrieve
  async retrieve(id: string): Promise<Customer> {
    const resp = await this.client.get(`/v1/customers/${id}`);
    return resp.data;
  }

  /** @deprecated Use `accounts.retrieve` instead. Removed at v2. */
  async get(id: string): Promise<Customer> {
    return this.retrieve(id);
  }

  // List, with pagination
  async list(per_page?: number, page?: number): Promise<CustomerListResponse> {
    const resp = await this.client.get('/v1/customers', {
      params: { per_page, page }
    });
    return resp.data;
  }

  async iterateAllCustomers(per_page = 20) {
    return paginate<Customer>(async (page: number) => {
      const res = await this.client.get('/v1/customers', {
        params: { per_page, page }
      });
      return res.data;
    }, per_page);
  }

  /**
   * @deprecated Use `accounts.disable` instead. Removed at v2. This continues to
   * hit `DELETE /v1/customers/{id}`; the customer-lifecycle equivalent on the
   * accounts resource is `accounts.disable`.
   */
  async delete(id: string): Promise<DeleteResponse> {
    const resp = await this.client.delete(`/v1/customers/${id}`);
    return resp.data;
  }

  // Search
  async search(params: SearchCustomerParams): Promise<CustomerListResponse> {
    const resp = await this.client.get('/v1/customers/search', { params: params });
    return resp.data;
  }

  /**
   * @deprecated Use `accounts.block` instead. Removed at v2. The accounts
   * equivalent (`POST /v1/accounts/{id}/block`) is pending a monolith route and
   * is not yet available; this method remains functional against
   * `POST /v1/customers/{id}/block` until then.
   */
  async block(id: string): Promise<Customer> {
    const resp = await this.client.post(`/v1/customers/${id}/block`);
    return resp.data;
  }

  /**
   * @deprecated Use `accounts.unblock` instead. Removed at v2. The accounts
   * equivalent (`POST /v1/accounts/{id}/unblock`) is pending a monolith route and
   * is not yet available; this method remains functional against
   * `POST /v1/customers/{id}/unblock` until then.
   */
  async unblock(id: string): Promise<Customer> {
    const resp = await this.client.post(`/v1/customers/${id}/unblock`);
    return resp.data;
  }

  /**
   * @deprecated Use `paymentMethods.list({ account_id })` instead (FRA-4461).
   * Removed at v2. Remains functional against
   * `GET /v1/customers/{id}/payment_methods`.
   */
  async getPaymentMethods(id: string): Promise<PaymentMethod[]> {
    const resp = await this.client.get(`/v1/customers/${id}/payment_methods`);
    return resp.data;
  }
}