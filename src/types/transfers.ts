import type { PaginationMeta } from './customers';

export interface Transfer {
  id: string;
  object: string;
  amount: number;
  currency: string;
  status: string;
  source_account_id?: string;
  destination_account_id?: string;
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
  currency: string;
  source_account_id?: string;
  destination_account_id?: string;
  metadata?: Record<string, unknown>;
}
