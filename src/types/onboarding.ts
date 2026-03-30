export interface OnboardingSession {
  id: string;
  object: string;
  status: string;
  customer_id?: string | null;
  entry_point?: string | null;
  steps?: Record<string, unknown>;
  client_secret?: string | null;
  expires_at?: number | null;
  livemode: boolean;
  created_at: number;
  metadata?: Record<string, unknown> | null;
  components?: Record<string, unknown> | null;
}

export interface OnboardingSessionListResponse {
  object: string;
  data: OnboardingSession[];
  has_more: boolean;
  url: string;
}

export interface ListOnboardingSessionsParams {
  customer_id?: string;
  status?: string;
  limit?: number;
  starting_after?: string;
}

export interface CreateOnboardingSessionParams {
  customer_id?: string;
  entry_point?: string;
  metadata?: Record<string, unknown>;
  components?: Record<string, unknown>;
}

export interface UpdateOnboardingSessionParams {
  steps?: Record<string, unknown>;
  status?: string;
}

export interface OnboardingPayoutParams {
  payout_method_id: string;
}
