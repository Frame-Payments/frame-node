import type { PaginationMeta } from './customers';
import type { PaymentMethod } from "./payment_methods";

export interface Transfer {
  id: string;
  object: string;
  amount: number;
  currency?: string;
  status: string;
  account_id?: string;
  source_payment_method: PaymentMethod | null;
  destination_payment_method: PaymentMethod | null;
  description?: string;
  seller_id: string | null;
  reference: string | null;
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface TransferListResponse {
  meta: PaginationMeta;
  data: Transfer[];
}

export interface CreateTransferParams {
  amount: number;
  account_id: string;
  currency?: string;
  source_payment_method_id?: string;
  destination_payment_method_id?: string;
  description?: string;
  seller_id?: string;
  confirm?: boolean;
  sonar_session_id?: string;
  reference?: string;
  metadata?: Record<string, unknown>;
}
