import type { AxiosInstance } from 'axios';
import type {
  InvoiceLineItem,
  InvoiceLineItemListResponse,
  CreateInvoiceLineItemParams,
  UpdateInvoiceLineItemParams
} from '../types/invoice_line_items';
import type { 
    DeleteInvoiceResponse 
} from '../types/invoices';

export class InvoiceLineItemsAPI {
  constructor(private client: AxiosInstance) {}

  async list(invoiceId: string): Promise<InvoiceLineItemListResponse> {
    const resp = await this.client.get(`/v1/invoices/${invoiceId}/line_items`);
    return resp.data;
  }

  async create(invoiceId: string, params: CreateInvoiceLineItemParams): Promise<InvoiceLineItem> {
    const resp = await this.client.post(`/v1/invoices/${invoiceId}/line_items`, params);
    return resp.data;
  }

  async update(invoiceId: string, lineItemId: string, params: UpdateInvoiceLineItemParams): Promise<InvoiceLineItem> {
    const resp = await this.client.patch(`/v1/invoices/${invoiceId}/line_items/${lineItemId}`, params);
    return resp.data;
  }

  async get(invoiceId: string, lineItemId: string): Promise<InvoiceLineItem> {
    const resp = await this.client.get(`/v1/invoices/${invoiceId}/line_items/${lineItemId}`);
    return resp.data;
  }

  async delete(invoiceId: string, lineItemId: string): Promise<DeleteInvoiceResponse> {
    const resp = await this.client.delete(`/v1/invoices/${invoiceId}/line_items/${lineItemId}`);
    return resp.data;
  }
}