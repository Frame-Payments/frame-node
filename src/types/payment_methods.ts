import type { Address } from "./customers";

export interface PaymentCard {
  brand: string;
  exp_month: string;
  exp_year: string;
  issuer?: string;
  currency?: string;
  segment?: string;
  type?: string;
  last_four: string;
}

export interface PaymentMethod {
  id: string;
  object: string;
  customer?: string | null;
  billing: Address;
  type: string;
  livemode: Boolean;
  created: number;
  updated: number;
  status: "active" | "blocked";
  card: PaymentCard;
}

export interface PaymentMethodListResponse {
  data: PaymentMethod[];
  meta?: { page?: number; per_page?: number; has_more?: boolean };
}

export interface CreatePaymentMethodParams {
  customer?: string;
  billing?: Address;
  type: "card" | "ach";
  card_number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
}

export interface UpdatePaymentMethodParams {
  billing?: Address;
  exp_month?: number;
  exp_year?: number;
}