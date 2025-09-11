import type { InvoiceLineItem } from "./invoice_line_items";

export enum InvoiceStatus { 
  DRAFT = 'draft', 
  OUTSTANDING = 'outstanding', 
  DUE = 'due', 
  OVERDUE = 'overdue', 
  PAID = 'paid', 
  WRITTEN_OFF = 'written_off', 
  VOIDED = 'voided' 
}

export enum CollectionMethod { 
  AUTO_CHARGE = 'auto_charge', 
  REQUEST_PAYMENT = 'request_payment' 
}

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
  metadata?: Record<string, any>;
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