export type DisputeReason = 'bank_cannot_process' | 'check_returned' | 'credit_not_processed' | 'customer_initiated' | 'debit_not_authorized' | 'duplicate' | 'fraudulent' | 'general' | 'incorrect_account_details' | 'insufficient_funds' | 'product_not_received' | 'product_unacceptable' | 'subscription_canceled' | 'unrecognized';

export type DisputeStatus = 'warning_needs_response' | 'warning_under_review' | 'warning_closed' | 'needs_response' | 'under_review' | 'won' | 'lost';

export interface DisputeEvidence {
  access_activity_log?: string;
  billing_address?: string;
  cancellation_policy?: string;
  cancellation_policy_disclosure?: string;
  cancellation_rebuttal?: string;
  customer_email_address?: string;
  customer_name?: string;
  customer_purchase_ip?: string;
  duplicate_charge_explanation?: string;
  duplicate_charge_id?: string;
  product_description?: string;
  refund_policy_disclosure?: string;
  shipping_tracking_number?: string;
  uncategorized_text?: string;
}

export interface Dispute {
  id: string;
  object: string;
  amount: number;
  charge?: string | null;
  currency: string;
  evidence: DisputeEvidence;
  charge_intent?: string | null;
  reason: DisputeReason;
  status: DisputeStatus;
  livemode: boolean;
  created: number;
  updated: number;
}

export interface DisputeListResponse {
  data: Dispute[];
}

export interface UpdateDisputeParams {
  evidence?: DisputeEvidence;
  submit?: boolean;
}