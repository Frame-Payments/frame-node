import type { Address } from "./customers";

export interface ChargeIntent {
  id: string;
  currency: string;
  amount: number;
  status: 'incomplete' | 'pending' | 'canceled' | 'refunded' | 'reversed' | 'failed' | 'disputed' | 'succeeded';
  description?: string | null;
  metadata?: Record<string, any>;
  latest_charge?: Record<string, any>;
  customer?: string;  // could link to Customer type
  payment_method?: string; // could link to PaymentMethod type
  client_secret?: string;
  authorization_mode?: string;
  failure_description?: string | null;
  shipping?: Address;
  object?: string;
  created?: number;
  updated?: number;
  livemode: boolean;
}

export interface PaginationMeta {
  page: number;
  url: string;
  has_more: boolean;
  prev: string | null;
  next: number | null;
}

export interface ChargeIntentListResponse {
  meta: PaginationMeta;
  data: ChargeIntent[];
}

export interface UpdateChargeIntentParams {
  amount?: number;
  customer?: string;
  description?: string;
  payment_method?: string;
  metadata?: Record<string, any>;
}

export interface CreateChargeIntentParams {
  amount: number;
  currency: string;
  customer?: string;
  description?: string;
  payment_method?: string;
  confirm?: boolean;
  receipt_email?: string;
  metadata?: Record<string, any>;
  authorization_mode: "automatic" | "manual";
  customer_data?: CustomerDataParams;
  payment_method_data?: PaymentMethodDataParams;
}

export interface CustomerDataParams {
  name: string;
  email: string;
}

export interface PaymentMethodDataParams {
  attach: boolean;
  billing?: Address;
  type: "card";
  card_number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
}