export interface Charge {
  id: string;
  object: string;
  amount: number;
  currency: string;
  status: string;
  charge_intent_id?: string;
  payment_method_id?: string;
  customer_id?: string;
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface ChargeTrace {
  charge_id: string;
  events: Array<{ type: string; created: number; data: Record<string, unknown> }>;
}
