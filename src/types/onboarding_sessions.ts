export interface OnboardingSession {
  id: string;
  object: string;
  account_id: string;
  client_secret: string;
  steps: string[];
  return_url?: string | null;
  expires_at: number;
  livemode: boolean;
}

export interface CreateOnboardingSessionParams {
  account_id: string;
  steps?: string[];
  return_url?: string;
}
