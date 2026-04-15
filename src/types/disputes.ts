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
  amount_cents: number;
  amount_currency: string;
  charge_intent?: Record<string, unknown> | null;
  reason?: { code: string; description: string; category: string } | null;
  status: DisputeStatus;
  display_status?: string;
  acquirer_reference_number?: string | null;
  authorization_code?: string | null;
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

export interface CreateDisputeDocumentParams {
  file_id?: string;
  document_type?: string;
  metadata?: Record<string, unknown>;
}

export interface DisputeDocument {
  id: string;
  object: string;
  dispute_id: string;
  file_id?: string;
  document_type?: string;
  metadata?: Record<string, unknown>;
  created: number;
  livemode: boolean;
}