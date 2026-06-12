import type { PaginationMeta } from './customers';

type FeeApplicationMode = 'deduct' | 'add_on' | 'absorb';

type FeeType = 'flat_plus_percentage' | 'flat' | 'percentage';

type BillableEventType = 'transfer.charge.card' | 'transfer.charge.ach' | 'transfer.payout.ach' | 'transfer.payout.push_to_card';

interface TransferFeePlanItem {
  id: string;
  object: string;
  fee_type: FeeType;
  amount_fixed_cents: number;
  amount_fixed_currency: string;
  amount_percentage: string;
  billable_event_type: string;
  created: number;
  updated: number;
}

interface CreateTransferFeePlanItemParams {
  fee_type: FeeType;
  amount_fixed_cents?: number;
  amount_fixed_currency?: string;
  amount_percentage?: number;
  billable_event_type?: BillableEventType;
}

export interface TransferFeePlan {
  id: string;
  object: string;
  name: string;
  fee_application_mode: FeeApplicationMode;
  items: TransferFeePlanItem[];
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
  fee_application_mode?: FeeApplicationMode;
  items?: CreateTransferFeePlanItemParams[];
}
