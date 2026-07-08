import type { PaginationMeta } from './customers';

export interface WebhookEndpoint {
  id: string;
  object: string;
  url: string;
  status: string;
  description?: string;
  // Event codes this endpoint is subscribed to (canonical event-code catalog).
  event_codes: string[];
  // The signing secret is returned ONLY on create and rotateSecret — never on
  // list or retrieve. Surface it to the merchant once; rotate to obtain a new one.
  secret?: string;
  livemode: boolean;
  created: number;
  updated: number;
}

export interface WebhookEndpointListResponse {
  meta: PaginationMeta;
  data: WebhookEndpoint[];
}

export interface CreateWebhookEndpointParams {
  // HTTPS URL Frame will POST events to.
  url: string;
  // Event codes to subscribe to. Must be drawn from the canonical event-code catalog.
  event_codes: string[];
  // Optional human-readable description.
  description?: string;
}

export interface UpdateWebhookEndpointParams {
  url?: string;
  description?: string;
  // Replacement list of event codes.
  event_codes?: string[];
}

// Returned by delete — a soft-deletion stub, not a full endpoint object.
export interface DeletedWebhookEndpoint {
  id: string;
  object: string;
  deleted: boolean;
}
