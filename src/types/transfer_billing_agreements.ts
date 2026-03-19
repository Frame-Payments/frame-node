import type { PaginationMeta } from './customers';

export interface TransferBillingAgreement {
  id: string;
  object: string;
  status: string;
  account_id?: string;
  transfer_fee_plan_id?: string;
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface TransferBillingAgreementListResponse {
  meta: PaginationMeta;
  data: TransferBillingAgreement[];
}

export interface CreateTransferBillingAgreementParams {
  account_id?: string;
  transfer_fee_plan_id?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateTransferBillingAgreementParams {
  status?: string;
  metadata?: Record<string, unknown>;
}
