import type { PaginationMeta } from './customers';

export interface Geofence {
  id: string;
  object: string;
  name: string;
  geofence_type: string;
  active: boolean;
  geofence_rules?: unknown[];
  created: number;
  updated: number;
}

export interface GeofenceListResponse {
  meta: PaginationMeta;
  data: Geofence[];
}
