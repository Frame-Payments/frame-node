import type { AxiosInstance } from 'axios';
import type {
    Customer,
    CustomerListResponse,
    CreateCustomerParams,
    UpdateCustomerParams,
    DeleteResponse,
    SearchCustomerParams
} from '../types/customers';

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
  async get(id: string): Promise<Customer> {
    const resp = await this.client.get(`/v1/customers/${id}`);
    return resp.data;
  }

  // List, with pagination
  async list(per_page?: number, page?: number): Promise<CustomerListResponse> {
    const resp = await this.client.get('/v1/customers', {
      params: { per_page, page }
    });
    return resp.data;
  }

  // Delete
  async delete(id: string): Promise<DeleteResponse> {
    const resp = await this.client.delete(`/v1/customers/${id}`);
    return resp.data;
  }

  // Search
  async search(params: SearchCustomerParams): Promise<CustomerListResponse> {
    const resp = await this.client.get('/v1/customers/search', { params: params });
    return resp.data;
  }

  // Block
  async block(id: string): Promise<Customer> {
    const resp = await this.client.post(`/v1/customers/${id}/block`);
    return resp.data;
  }

  // Unblock
  async unblock(id: string): Promise<Customer> {
    const resp = await this.client.post(`/v1/customers/${id}/unblock`);
    return resp.data;
  }
}