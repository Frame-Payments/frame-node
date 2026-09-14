export interface CreateIdvSessionResponse {
  inquiry_id: string;
}

export interface CompleteIdvSessionParams {
  inquiry_id: string;
}

export interface CompleteIdvSessionResponse {
  verified?: boolean;
  status?: string;
  category?: string;
  failure_type?: string;
  retriable?: boolean;
}
