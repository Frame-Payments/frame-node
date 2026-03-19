import type { PaginationMeta } from './customers';

export interface TransferFeePlan {
  id: string;
  object: string;
  name: string;
  fee_type: string;
  fee_amount?: number;
  fee_percentage?: number;
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface TransferFeePlanListResponse {
  meta: PaginationMeta;
  data: TransferFeePlan[];
}

export interface CreateTransferFeePlanParams {
  name: string;
  fee_type: string;
  fee_amount?: number;
  fee_percentage?: number;
  metadata?: Record<string, unknown>;
}
