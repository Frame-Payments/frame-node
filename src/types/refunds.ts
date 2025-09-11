export enum RefundStatus {
  PENDING = 'pending',
  REQUIRES_ACTION = 'requires_action',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELED = 'canceled'
}

export enum RefundReason { 
  DUPLICATE = 'duplicate', 
  FRADULENT = 'fraudulent', 
  REQUESTED = 'requested_by_customer', 
  EXPIRED = 'expired_uncaptured_charge'
}

export enum RefundReasonParam { 
  DUPLICATE = 'duplicate', 
  FRADULENT = 'fraudulent', 
  REQUESTED = 'requested_by_customer', 
}

export interface Refund {
  id: string;
  currency: string;
  status: RefundStatus | null;
  amount: number;
  reason: RefundReason | null;
  charge_intent?: string | null;
  object: string;
  livemode: boolean;
  created: number;
  updated: number;
}

export interface RefundListResponse {
  data: Refund[];
  meta?: {
    page?: number;
    per_page?: number;
    has_more?: boolean;
  };
}

export interface CreateRefundParams {
  charge_intent?: string;
  amount?: number;
  reason?: RefundReasonParam;
}