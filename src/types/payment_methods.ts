import type { Address } from "./customers";

export enum PaymentMethodStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  DETACHED = 'detached'
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
  account_id?: string | null;
  billing?: Address;
  type: string;
  livemode: boolean;
  created: number;
  updated?: number;
  status?: PaymentMethodStatus;
  card?: PaymentCard;
  ach?: BankAccount;
}

export interface PaymentMethodListResponse {
  data?: PaymentMethod[];
  meta?: { page?: number; per_page?: number; has_more?: boolean };
}

export interface CreateCardPaymentMethodParams {
  customer?: string;
  account?: string;
  billing?: Address;
  type: PaymentMethodType.CARD;
  card_number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
}

export interface CreateACHPaymentMethodParams {
  customer?: string;
  account?: string;
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

export interface ConnectPlaidParams {
  account: string;
  public_token: string;
  account_id: string;
  institution_name?: string;
  subtype?: string;
}

export interface ApplePayPaymentDataHeader {
  ephemeralPublicKey: string;
  publicKeyHash: string;
  transactionId: string;
}

export interface ApplePayPaymentData {
  version: string;
  data: string;
  signature: string;
  header: ApplePayPaymentDataHeader;
}

export interface ApplePayPaymentMethodInfo {
  displayName: string;
  network: string;
  type: string;
}

export interface ApplePayToken {
  paymentData: ApplePayPaymentData;
  paymentMethod: ApplePayPaymentMethodInfo;
  transactionIdentifier: string;
}

export interface ApplePayBillingContact {
  addressLines?: string[];
  locality?: string;
  administrativeArea?: string;
  postalCode?: string;
  countryCode?: string;
}

export interface ApplePayTokenDetails {
  token: ApplePayToken;
  billingContact?: ApplePayBillingContact;
}

export interface ApplePayDetails {
  requestId: string;
  methodName: string;
  payerName?: string;
  payerEmail?: string;
  details: ApplePayTokenDetails;
  device_key_id?: string;
  device_assertion?: string;
  device_client_data?: string;
}

export interface ApplePayWalletEnvelope {
  type: 'apple_pay';
  apple_pay: ApplePayDetails;
}

type ExactlyOneOwner =
  | { customer: string; account?: never }
  | { account: string; customer?: never };

export type CreateApplePayPaymentMethodParams = {
  type: 'card';
  _wallet: ApplePayWalletEnvelope;
} & ExactlyOneOwner;

export type GooglePayPaymentMethodData = Record<string, unknown>;

export interface GooglePayWalletData {
  apiVersion: number;
  apiVersionMinor: number;
  email?: string | null;
  paymentMethodData: GooglePayPaymentMethodData;
}

export interface GooglePayWalletEnvelope {
  type: 'google_pay';
  google_pay: GooglePayWalletData;
}

export type CreateGooglePayPaymentMethodParams = {
  type: 'card';
  _wallet: GooglePayWalletEnvelope;
} & ExactlyOneOwner;
