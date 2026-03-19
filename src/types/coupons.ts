import type { PaginationMeta } from './customers';

export interface Coupon {
  id: string;
  object: string;
  name: string;
  discount_type: string;
  amount_off?: number;
  percent_off?: number;
  currency?: string;
  duration: string;
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface CouponListResponse {
  meta: PaginationMeta;
  data: Coupon[];
}

export interface CreateCouponParams {
  name: string;
  discount_type: string;
  amount_off?: number;
  percent_off?: number;
  currency?: string;
  duration: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateCouponParams {
  name?: string;
  metadata?: Record<string, unknown>;
}
