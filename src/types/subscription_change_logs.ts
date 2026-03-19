import type { PaginationMeta } from './customers';

export interface SubscriptionChangeLog {
  id: string;
  object: string;
  subscription_id: string;
  change_type: string;
  changed_at: number;
  data?: Record<string, unknown>;
}

export interface SubscriptionChangeLogListResponse {
  meta: PaginationMeta;
  data: SubscriptionChangeLog[];
}
