export interface SonarSession {
  id: string;
  object: string;
  status: string;
  charge_intent_id?: string;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface CreateSonarSessionParams {
  charge_intent_id?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateSonarSessionParams {
  status?: string;
  metadata?: Record<string, unknown>;
}
