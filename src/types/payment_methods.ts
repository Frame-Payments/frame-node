import type { Address } from "./customers";

export enum PaymentMethodStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked'
}

export enum PaymentAccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings'
}

export enum PaymentMethodType {
  CARD = 'card',
  ACH = 'ach'
}

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

export interface BankAccount {
  account_type?: PaymentAccountType;
  account_number?: string;
  routing_number?: string;
  last_four?: string;
  bank_name?: string;
}

export interface PaymentMethod {
  id: string;
  object?: string;
  customer?: string | null;
  billing?: Address;
  type: string;
  livemode: Boolean;
  created: number;
  updated?: number;
  status?: PaymentMethodStatus;
  card?: PaymentCard;
  ach?: BankAccount;
}

export interface PaymentMethodListResponse {
  data: PaymentMethod[];
  meta?: { page?: number; per_page?: number; has_more?: boolean };
}

export interface CreateCardPaymentMethodParams {
  customer?: string;
  billing?: Address;
  type: PaymentMethodType.CARD;
  card_number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
}

export interface CreateACHPaymentMethodParams {
  customer?: string;
  billing?: Address;
  type: PaymentMethodType.ACH;
  account_type: PaymentAccountType;
  account_number: string;
  routing_number: string;
}

export interface UpdatePaymentMethodParams {
  billing?: Address;
  exp_month?: number;
  exp_year?: number;
}