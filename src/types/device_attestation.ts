export interface ChallengeResponse {
  challenge: string;
}

export interface AttestRequest {
  key_id: string;
  attestation_object: string;
  challenge: string;
}

export interface AttestResponse {
  status: string;
  key_id: string;
}
