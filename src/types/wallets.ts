import type { PaginationMeta } from './customers';

export interface WalletMoney {
  value: number;
  currency: string;
}

export type WalletStatus = 'pending' | 'provisioning' | 'active' | 'rejected' | 'closed';

export type WalletRejectedReason =
  | 'unsupported_region'
  | 'unsupported_account_type'
  | 'verification_declined'
  | null;

export interface Wallet {
  id: string;
  object: 'wallet';
  account_id: string;
  default: boolean;
  name: string;
  status: WalletStatus;
  rejected_reason: WalletRejectedReason;
  available: WalletMoney;
  metadata: Record<string, unknown>;
  livemode: boolean;
  created: number;
  updated: number;
}

export interface WalletListParams {
  page?: number;
  per_page?: number;
  account_id?: string;
}

export interface WalletListResponse {
  meta: PaginationMeta;
  data: Wallet[];
}

export interface UpdateWalletParams {
  name?: string;
  default?: boolean;
  metadata?: Record<string, unknown>;
}
