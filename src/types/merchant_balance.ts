// GET /v1/merchant_balance — the authenticated merchant's balance (available
// funds, reserved amounts, pending payouts). Amounts are dollars (float).
export interface MerchantBalance {
  merchant_id: string;
  currency: string;
  dots_balance: number;
  available_for_payout: number;
  reserved_amount: number;
  pending_payouts: number;
  last_updated_at: string | null;
  source: string;
  // status/reason_code are the only required fields — populated (e.g. status
  // "UNAVAILABLE", reason_code "DOTS_API_ERROR") when the balance provider is
  // unreachable.
  status: string;
  reason_code?: string;
}
