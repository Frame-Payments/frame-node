export enum SubscriptionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  TERMINATED = 'terminated',
  CANCELED = 'canceled'
}

export interface PlanDetails {
  id: string;
  interval: string;
  interval_count: number;
  product: string;
  amount: number;
  currency: string;
  object: string;
  active: boolean;
  created: number;
  livemode: boolean;
}

export interface Subscription {
  id: string;
  description?: string;
  current_period_start?: number;
  current_period_end?: number;
  livemode?: boolean;
  currency?: string;
  status?: SubscriptionStatus;
  customer?: string;
  default_payment_method?: string;
  plan?: PlanDetails;
  metadata?: Record<string, any>;
  object?: string;
  created?: number;
  updated?: number;
  start_date?: number;
}

export interface SubscriptionListResponse {
  meta: {
    page: number;
    url: string;
    has_more: boolean;
    prev: string | null;
    next: number | null;
  };
  subscriptions: Subscription[];
}

export interface CreateSubscriptionParams {
  customer: string;
  product: string;
  currency: string;
  default_payment_method: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface UpdateSubscriptionParams {
  default_payment_method?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface SearchSubscriptionParams {
  status?: string;
  created_before?: number;
  created_after?: number;
}