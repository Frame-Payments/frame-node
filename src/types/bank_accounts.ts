import type { PaymentAccountType } from './payment_methods';

/**
 * A bank account resource (`ba_…`) connected through a processor (e.g. Plaid),
 * owned by a customer or an account.
 *
 * Distinct from the `BankAccount` sub-shape in `./payment_methods`, which is the
 * ACH detail embedded on a payment method. This is the standalone
 * `/v1/bank_accounts` object; re-exported from the package root as
 * `BankAccountResource` to avoid a name collision with that sub-shape.
 */
export interface BankAccount {
  id: string;
  object?: string;
  routing_number?: string;
  account_number_last_4?: string;
  account_type?: PaymentAccountType;
  bank_name?: string;
  processor_name?: string;
  status?: string;
  customer_id?: string | null;
  account_id?: string | null;
  created?: number;
  updated?: number;
  livemode?: boolean;
}

/** Params for `bankAccounts.create` (`POST /v1/bank_accounts`). */
export interface CreateBankAccountParams {
  /** Processor used to connect the account, e.g. `"plaid"`. */
  processor: string;
  /** Processor-issued token for the connected account. */
  processor_token: string;
  /** Owning customer (`cus_…`). Provide this or `account_id`. */
  customer_id?: string;
  /** Owning account (`acct_…`). Provide this or `customer_id`. */
  account_id?: string;
}
