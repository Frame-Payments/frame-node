export interface Charge {
  id: string;
  object: string;
  amount: number;
  currency: string;
  status: string;
  charge_intent_id?: string;
  payment_method_id?: string;
  customer_id?: string;
  account?: string | null;
  acquirer_reference_number?: string | null;
  authorization_code?: string | null;
  refund_reason?: string | null;
  net_amount?: number;
  revenue_split?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface ChargeTrace {
  charge_id: string;
  events: Array<{ type: string; created: number; data: Record<string, unknown> }>;
}
