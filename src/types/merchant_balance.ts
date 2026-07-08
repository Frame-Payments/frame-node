// GET /v1/merchant_balance — the authenticated merchant's balance (available
// funds, reserved amounts, pending payouts). Amounts are dollars (float).
//
// Per the OpenAPI spec, `status` and `reason_code` are the only guaranteed
// fields: the documented 200 is the "balance unavailable" variant (status
// "UNAVAILABLE", reason_code "DOTS_API_ERROR"), where the balance figures are
// absent. On a healthy response the money/metadata fields are populated. They
// are therefore all optional and must be narrowed before use.
export interface MerchantBalance {
  status: string;
  reason_code?: string;
  merchant_id?: string;
  currency?: string;
  dots_balance?: number;
  available_for_payout?: number;
  reserved_amount?: number;
  pending_payouts?: number;
  last_updated_at?: string | null;
  source?: string;
}
