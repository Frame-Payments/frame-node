export interface ChargeSession {
  // The server sends the id as `sonar_session_id`, not `id` (confirmed against
  // Frame-iOS's wire contract, SonarSessionRequests.swift). Kept optional and
  // aliased alongside `id` so existing callers reading either field keep working.
  id?: string;
  sonar_session_id?: string;
  object: string;
  status: string;
  charge_intent_id?: string;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface CreateChargeSessionParams {
  charge_intent_id?: string;
  metadata?: Record<string, unknown>;
  // The Fingerprint visitor identifier used to associate the session with a
  // device fingerprint. Empty once the Fingerprint environment is activated
  // and withholds it, at which point `sealed_result` is what identifies the
  // device.
  fingerprint_visitor_id?: string;
  // The Frame account the session belongs to. Required for any session that
  // will back a payment: the server resolves a payment's session through the
  // account, so one created without this is invisible to risk checks and the
  // payment is rejected with `sonar_session_required`.
  account_id?: string;
  // The sealed Fingerprint identification event, base64-encoded. Sent alongside
  // `fingerprint_visitor_id` rather than instead of it, so the request works on
  // both sides of the sealed environment being activated. Omit entirely when
  // Fingerprint served no sealed result — a `sealed_result: null` is not the
  // same request to the API as one that omits it, so callers should leave this
  // field out rather than passing `undefined` if they want it truly absent.
  sealed_result?: string;
}

export interface UpdateChargeSessionParams {
  status?: string;
  metadata?: Record<string, unknown>;
  fingerprint_visitor_id?: string;
  account_id?: string;
  sealed_result?: string;
}
