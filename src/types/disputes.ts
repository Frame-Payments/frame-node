export enum DisputeReason { 
  BANK_CANNOT_PROCESS = 'bank_cannot_process',
  CHECK_RETURNED = 'check_returned',
  CREDIT_NOT_PROCESSED = 'credit_not_processed',
  CUSTOMER_INITIATED = 'customer_initiated',
  DEBIT_NOT_AUTHORIZED = 'debit_not_authorized',
  DUPLICATE = 'duplicate',
  FRADULENT = 'fraudulent', 
  GENERAL = 'general',
  INCORRECT_ACCOUNT_DETAILS = 'incorrect_account_details',
  INSUFFICIENT_FUNDS = 'insufficient_funds',
  PRODUCT_NOT_RECEIVED = 'product_not_received',
  PRODUCT_UNACCEPTABLE = 'product_unacceptable' ,
  SUBSCRIPTION_CANCELED = 'subscription_canceled',
  UNRECOGNIZED = 'unrecognized' 
}

export enum DisputeStatus { 
  WARNING_NEEDS_RESPONSE = 'warning_needs_response',
  WARNING_UNDER_REVIEW ='warning_under_review',
  WARNING_CLOSED ='warning_closed',
  NEEDS_RESPONSE = 'needs_response', 
  UNDER_REVIEW = 'under_review', 
  WON = 'won', 
  LOST = 'lost' 
}

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