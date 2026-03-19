export interface TermsOfServiceTokenResponse {
  token: string;
}

export interface AcceptTermsOfServiceParams {
  token: string;
  accepted_at?: number;
  ip_address?: string;
  user_agent?: string;
}
