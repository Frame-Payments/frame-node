export interface PaymentLinkSession {
  id: string;
  object: string;
  url: string;
  status: string;
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface CreatePaymentLinkSessionParams {
  amount?: number;
  currency?: string;
  customer_id?: string;
  metadata?: Record<string, unknown>;
}
