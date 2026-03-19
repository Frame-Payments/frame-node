export interface Payout {
  id: string;
  object: string;
  amount: number;
  currency: string;
  status: string;
  payment_method_id?: string;
  account_id?: string;
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface CreatePayoutParams {
  amount: number;
  currency: string;
  payment_method_id: string;
  metadata?: Record<string, unknown>;
}
