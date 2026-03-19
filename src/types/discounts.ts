import type { PaginationMeta } from './customers';

export interface Discount {
  id: string;
  object: string;
  coupon_id: string;
  promotion_code_id?: string;
  customer_id?: string;
  subscription_id?: string;
  start?: number;
  end?: number;
  created: number;
  livemode: boolean;
}

export interface DiscountListResponse {
  meta: PaginationMeta;
  data: Discount[];
}

export interface ValidateDiscountsParams {
  promotion_codes: string[];
  customer_id?: string;
}
