export interface InvoiceLineItem {
  object: string;
  id: string;
  quantity: number;
  description: string;
  unit_amount_cents?: number;
  unit_amount_currency?: number;
  created?: number;
  updated?: number;
  product?: {
    object: string;
    id: string;
    name: string;
    price: number;
  };
}

export interface InvoiceLineItemListResponse {
  data: InvoiceLineItem[];
}

export interface CreateInvoiceLineItemParams {
  product: string;
  quantity: number;
}

export interface UpdateInvoiceLineItemParams {
  product?: string;
  quantity?: number;
}