import type { InvoiceLineItem } from "./invoice_line_items";

export type InvoiceStatus = 'draft' | 'outstanding' | 'due' | 'overdue' | 'paid' | 'written_off' | 'voided';

export type CollectionMethod = 'auto_charge' | 'request_payment';

export interface CustomerRef {
  object: string;
  id: string;
  name?: string;
}

export interface Invoice {
  id: string;
  customer: CustomerRef;
  object: string;
  total: number;
  currency: string;
  status: InvoiceStatus;
  collection_method: CollectionMethod;
  net_terms: number;
  invoice_number?: string;
  description?: string;
  memo?: string;
  livemode: boolean;
  metadata: Record<string, any>;
  line_items: InvoiceLineItem[];
  created: number;
  updated: number;
}

export interface InvoiceListResponse {
  data: Invoice[];
  meta?: {
    page?: number;
    has_more?: boolean;
    url?: string;
  };
}

export interface DeleteInvoiceResponse {
    object: string;
    deleted: boolean;
}

export interface CreateInvoiceParams {
  customer: string;
  collection_method: CollectionMethod;
  net_terms?: number;
  number?: string;
  description?: string;
  memo?: string;
  metadata?: Record<string, any>;
  line_items?: Array<{
    product: string;
    quantity: number;
  }>;
}

export interface UpdateInvoiceParams {
  collection_method?: CollectionMethod;
  net_terms?: number;
  number?: string;
  description?: string;
  memo?: string;
  metadata?: Record<string, any>;
  line_items?: Array<{
    product: string;
    quantity: number;
  }>;
}