export interface OnboardingSession {
  id: string;
  object: string;
  account_id: string;
  client_secret: string;
  steps: string[];
  return_url?: string | null;
  expires_at: number;
  livemode: boolean;
  url?: string;
}

export interface CreateOnboardingSessionParams {
  account_id: string;
  steps?: string[];
  return_url?: string;
}

// Returned by GET /v1/onboarding_sessions/bootstrap: session metadata plus the
// full account context in one payload (for the embedded onboarding component).
export interface OnboardingSessionBootstrap extends OnboardingSession {
  // Full account object as returned in the bootstrap payload. Left as an opaque
  // record — the canonical Account shape lives in ../types/accounts and callers
  // that need it can narrow.
  account: Record<string, unknown>;
}
