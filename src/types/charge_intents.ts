import type { Address } from './customers';
import type { PaymentMethod } from './payment_methods';

export enum ChargeIntentStatus {
  INCOMPLETE = 'incomplete',
  PENDING = 'pending',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
  REVERSED = 'reversed',
  FAILED = 'failed',
  DISPUTED = 'disputed',
  SUCCEEDED = 'succeeded',
}

export enum AuthorizationMode {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
}

export enum ChargeStatus {
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export interface Charge {
  id: string;
  currency: string;
  amount_captured: number;
  amount_refunded: number;
  captured: boolean;
  disputed: boolean;
  charge_intent: string;
  refunded: boolean;
  failure_code?: string | null;
  failure_message?: string | null;
  description?: string | null;
  status: ChargeStatus;
  payment_method_details: PaymentMethod;
  customer: string;
  payment_method: string;
  amount: number;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface ChargeIntent {
  id: string;
  currency: string;
  amount: number;
  status: ChargeIntentStatus;
  description?: string | null;
  metadata?: Record<string, any>;
  latest_charge?: Charge;
  customer?: string;
  payment_method?: string;
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
  authorization_mode: AuthorizationMode;
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
  type: 'card';
  card_number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
}
