import type { PaginationMeta } from './customers';
import type { TransferFeePlan } from './transfer_fee_plans';

type TransferBillingStatus = 'pending' | 'active' | 'inactive';
type TransferBillingCategory = 'charge' | 'payout';

export interface TransferBillingAgreement {
  id: string;
  status: TransferBillingStatus;
  category: TransferBillingCategory;
  effective_date: string;
  object: string;
  account_id: string | null;
  fee_plan: TransferFeePlan | null;
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
  status?: TransferBillingStatus;
  transfer_fee_plan_id: string;
  effective_date: string;
  category: TransferBillingCategory;
}

export interface UpdateTransferBillingAgreementParams {
  status: TransferBillingStatus;
}
