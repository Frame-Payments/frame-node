export type PricingType = 'static' | 'relative';

export type DurationType = 'finite' | 'infinite';

export interface SubscriptionPhase {
  id: string;
  ordinal: number;
  name?: string | null;
  pricing_type: PricingType;
  duration_type: DurationType;
  amount?: number | null;
  currency: string;
  discount_percentage?: number | null;
  period_count?: number | null; 
  interval?: string | null;
  interval_count?: number | null;
  livemode: boolean;
  created: number;
  updated: number;
  object: string;
}

export interface SubscriptionPhaseListResponse {
  phases: SubscriptionPhase[];
  meta: {
    subscription_id: string;
  };
}

export interface CreateSubscriptionPhaseParams {
  ordinal: number;
  pricing_type: PricingType;
  duration_type: DurationType;
  name?: string;
  amount_cents?: number;
  currency: string;
  discount_percentage?: number;
  period_count?: number;
  interval?: string;
  interval_count?: number;
}

export interface UpdateSubscriptionPhaseParams {
  ordinal?: number;
  name?: string;
  pricing_type?: PricingType;
  duration_type?: DurationType;
  amount_cents?: number;
  discount_percentage?: number;
  period_count?: number;
  interval?: string;
  interval_count?: number;
}