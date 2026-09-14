export interface EvervaultConfiguration {
  app_id: string | null;
  team_id: string | null;
}

export interface SiftConfiguration {
  account_id: string | null;
  beacon_key: string | null;
}

export interface FingerprintConfiguration {
  api_key: string | null;
  region: string | null;
  environment: string | null;
}

export interface LegalConfiguration {
  privacy_url: string | null;
  terms_url: string | null;
  platform_agreement_url: string | null;
  cbc_terms_and_conditions: string | null;
}

export interface MapboxConfiguration {
  access_token: string | null;
  expires_at: string | null;
}

export interface AllConfiguration {
  evervault?: EvervaultConfiguration;
  fingerprint?: FingerprintConfiguration;
  sift?: SiftConfiguration;
  legal?: LegalConfiguration;
  mapbox?: MapboxConfiguration;
}
