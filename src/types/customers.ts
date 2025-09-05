import type { PaymentMethod } from "./payment_methods";

export interface Address {
  line_1?: string;
  line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export interface Customer {
  id: string;
  created: number;
  updated: number;
  livemode: boolean;
  name: string;
  email: string;
  description?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  billing_address?: Address | null;
  shipping_address?: Address | null;
  status: 'active' | 'blocked';
  payment_methods: PaymentMethod[];
  metadata: Record<string, any>;
  object: string;
}

export interface PaginationMeta {
  page: number;
  url: string;
  has_more: boolean;
  prev: string | null;
  next: string | null;
}

export interface CustomerListResponse {
  meta: PaginationMeta;
  data: Customer[];
}

export interface CreateCustomerParams {
  name: string;
  email: string;
  description?: string;
  phone?: string;
  ssn?: string;
  date_of_birth?: string;
  billing_address?: Address;
  shipping_address?: Address;
  metadata?: Record<string, any>;
}

export interface UpdateCustomerParams {
  name?: string;
  email?: string;
  description?: string;
  phone?: string;
  ssn?: string;
  date_of_birth?: string;
  billing_address?: Address;
  shipping_address?: Address;
  metadata?: Record<string, any>;
}

export interface SearchCustomerParams {
  name?: string;
  email?: string;
  phone?: string;
  created_before?: number;
  created_after?: number;
}

export interface DeleteResponse {
  id: string;
  object: string;
  deleted: boolean;
}