export interface ChargeSession {
  id: string;
  object: string;
  status: string;
  charge_intent_id?: string;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface CreateChargeSessionParams {
  charge_intent_id?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateChargeSessionParams {
  status?: string;
  metadata?: Record<string, unknown>;
}
