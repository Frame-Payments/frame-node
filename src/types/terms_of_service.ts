export interface TermsOfServiceTokenResponse {
  token: string;
}

export interface UpdateTermsOfServiceParams {
  token: string;
  accepted_at?: number;
  ip_address?: string;
  user_agent?: string;
}
