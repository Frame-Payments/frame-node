import type { AxiosInstance } from 'axios';
import type {
    Invoice,
    InvoiceListResponse,
    CreateInvoiceParams,
    UpdateInvoiceParams,
    DeleteInvoiceResponse
} from '../types/invoices';

export class InvoicesAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateInvoiceParams): Promise<Invoice> {
    const resp = await this.client.post('/v1/invoices', params);
    return resp.data;
  }

  async update(id: string, params: UpdateInvoiceParams): Promise<Invoice> {
    const resp = await this.client.patch(`/v1/invoices/${id}`, params);
    return resp.data;
  }

  async retrieve(id: string): Promise<Invoice> {
    const resp = await this.client.get(`/v1/invoices/${id}`);
    return resp.data;
  }

  /** @deprecated Use `retrieve` instead. Removed at v2. */
  async get(id: string): Promise<Invoice> {
    return this.retrieve(id);
  }

  async list(per_page?: number, page?: number, customer?: string, status?: string): Promise<InvoiceListResponse> {
    const resp = await this.client.get('/v1/invoices', {
      params: { per_page, page, customer, status }
    });
    return resp.data;
  }

  async delete(id: string): Promise<DeleteInvoiceResponse> {
    const resp = await this.client.delete(`/v1/invoices/${id}`);
    return resp.data;
  }

  async issue(id: string): Promise<Invoice> {
    const resp = await this.client.post(`/v1/invoices/${id}/issue`);
    return resp.data;
  }
}