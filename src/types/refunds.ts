export type RefundStatus = 'pending' | 'requires_action' | 'succeeded' | 'failed' | 'canceled';

export type RefundReason = 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge';

export type RefundReasonParam = 'duplicate' | 'fraudulent' | 'requested_by_customer'

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