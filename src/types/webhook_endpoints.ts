import type { PaginationMeta } from './customers';

export interface WebhookEndpoint {
  id: string;
  object: string;
  url: string;
  status: string;
  enabled_events: string[];
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface WebhookEndpointListResponse {
  meta: PaginationMeta;
  data: WebhookEndpoint[];
}
