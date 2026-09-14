export interface ChargeSession {
  // Server sends sonar_session_id, not id; id kept optional for compatibility.
  id?: string;
  sonar_session_id?: string;
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
  fingerprint_visitor_id?: string;
  // Required for a session backing a payment, or it's invisible to risk checks.
  account_id?: string;
  // Omit rather than send null — the API treats them differently.
  sealed_result?: string;
}

export interface UpdateChargeSessionParams {
  status?: string;
  metadata?: Record<string, unknown>;
  fingerprint_visitor_id?: string;
  account_id?: string;
  sealed_result?: string;
}
