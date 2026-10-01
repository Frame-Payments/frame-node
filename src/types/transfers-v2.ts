import type { PaginationMeta } from './customers';

export interface TransferV2Money {
  value: number;
  currency?: string;
}

export interface TransferV2EndpointSlot {
  account_id?: string;
  payment_method_id?: string;
  wallet_id?: string;
  rail?: string;
  speed?: string;
  payment_method?: Record<string, unknown>;
}

export interface TransferV2Payment {
  status?: string;
  authorization_mode?: string;
  failure_code?: string | null;
  failure_reason?: string | null;
  amount_authorized?: TransferV2Money;
  amount_captured?: TransferV2Money;
  amount_refunded?: TransferV2Money;
  [key: string]: unknown;
}

export interface TransferV2Payout {
  status?: string;
  rail?: string;
  speed?: string;
  failure_code?: string | null;
  failure_reason?: string | null;
}

export interface TransferV2 {
  id: string;
  object: string;
  type?: string;
  status?: string;
  description?: string | null;
  amount?: TransferV2Money;
  fee?: TransferV2Money;
  net_amount?: TransferV2Money;
  livemode?: boolean;
  created?: number;
  reference?: string | null;
  metadata?: Record<string, unknown>;
  source?: Record<string, unknown> | null;
  destination?: Record<string, unknown> | null;
  payment?: TransferV2Payment | null;
  payout?: TransferV2Payout | null;
  account_transfer?: Record<string, unknown> | null;
  client_secret?: string | null;
  next_action?: Record<string, unknown> | null;
}

export interface TransferV2ListResponse {
  meta: PaginationMeta;
  data: TransferV2[];
}

export interface CreateTransferV2Params {
  amount: TransferV2Money;
  source?: TransferV2EndpointSlot;
  destination?: TransferV2EndpointSlot;
  confirm?: boolean;
  authorization_mode?: string;
  description?: string;
  reference?: string;
  receipt_email?: string;
  statement_descriptor?: string;
  product_id?: string;
  payment_link_id?: string;
  subscription_id?: string;
  invoice_id?: string;
  sonar_session_id?: string;
  shipping?: Record<string, unknown>;
  payment_method_options?: Record<string, unknown>;
  cart_data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AmountOnlyV2Params {
  amount?: TransferV2Money;
}

export interface TransferV2CreateOptions {
  /** Opaque idempotency key (1–255 chars). A UUID is generated when omitted. */
  idempotencyKey?: string;
}
