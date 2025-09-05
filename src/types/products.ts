export interface Product {
  id: string;
  name: string;
  livemode: boolean;
  image: string | null;
  description: string;
  url: string | null;
  shippable: boolean;
  active: boolean;
  default_price: number;
  metadata: Record<string, string>;
  created: number;
  updated: number;
  object: string;
}

export interface DeletedProduct {
    id: string;
    object: string;
    deleted: boolean;
}

export interface ProductListResponse {
  meta: {
    page: number;
    url: string;
    has_more: boolean;
  };
  data: Product[];
}

export type ProductRecurringInterval = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'every_3_months' | 'every_6_months';

export type ProductPurchaseType = 'one_time' | 'recurring';

export interface CreateProductParams {
  name: string;
  description: string;
  default_price: number;
  purchase_type: ProductPurchaseType;
  recurring_interval?: ProductRecurringInterval | null;
  shippable?: boolean | null;
  url?: string | null;
  metadata?: Record<string, string> | null;
}

export interface UpdateProductParams {
  name?: string;
  description?: string;
  default_price?: number;
  shippable?: boolean;
  url?: string;
  metadata?: Record<string, string>;
}

export interface SearchProductParams {
  name?: string;
  active?: boolean;
  shippable?: boolean;
}