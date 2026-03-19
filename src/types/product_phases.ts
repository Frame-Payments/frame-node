import type { PaginationMeta } from './customers';

export interface ProductPhase {
  id: string;
  object: string;
  product_id: string;
  name?: string;
  amount: number;
  currency: string;
  interval?: string;
  interval_count?: number;
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface ProductPhaseListResponse {
  meta: PaginationMeta;
  data: ProductPhase[];
}

export interface CreateProductPhaseParams {
  name?: string;
  amount: number;
  currency: string;
  interval?: string;
  interval_count?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateProductPhaseParams {
  name?: string;
  amount?: number;
  metadata?: Record<string, unknown>;
}
