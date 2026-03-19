import type { PaginationMeta } from './customers';

export interface PromotionCode {
  id: string;
  object: string;
  code: string;
  coupon_id: string;
  active: boolean;
  max_redemptions?: number;
  times_redeemed: number;
  expires_at?: number;
  metadata?: Record<string, unknown>;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface PromotionCodeListResponse {
  meta: PaginationMeta;
  data: PromotionCode[];
}

export interface CreatePromotionCodeParams {
  code: string;
  coupon_id: string;
  active?: boolean;
  max_redemptions?: number;
  expires_at?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdatePromotionCodeParams {
  active?: boolean;
  metadata?: Record<string, unknown>;
}
