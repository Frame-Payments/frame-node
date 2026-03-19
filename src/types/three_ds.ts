export interface ThreeDSIntent {
  id: string;
  object: string;
  status: string;
  charge_intent_id?: string;
  payment_method_id?: string;
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface CreateThreeDSIntentParams {
  charge_intent_id?: string;
  payment_method_id?: string;
  metadata?: Record<string, unknown>;
}
