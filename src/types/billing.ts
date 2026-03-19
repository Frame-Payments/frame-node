export interface Metering {
  id: string;
  object: string;
  event_name: string;
  customer_id?: string;
  value: number;
  timestamp?: number;
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface CreateMeteringParams {
  event_name: string;
  customer_id?: string;
  value: number;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateMeteringParams {
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface MeteringEvent {
  id: string;
  object: string;
  event_name: string;
  customer_id?: string;
  value: number;
  timestamp?: number;
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface CreateMeteringEventParams {
  event_name: string;
  customer_id?: string;
  value: number;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateMeteringEventParams {
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface BillingInvoice {
  id: string;
  object: string;
  customer_id?: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface CreateBillingInvoiceParams {
  customer_id?: string;
  subscription_id?: string;
  metadata?: Record<string, unknown>;
}

export interface BillingCredit {
  id: string;
  object: string;
  customer_id?: string;
  amount: number;
  currency: string;
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface CreateBillingCreditParams {
  customer_id?: string;
  amount: number;
  currency: string;
  metadata?: Record<string, unknown>;
}

export interface BillingReport {
  data: Record<string, unknown>[];
  meta?: Record<string, unknown>;
}
