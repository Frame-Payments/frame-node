# Changelog

## 2.4.0

Publishable-key-only mobile clients (starting with `framepayments-react-native`, FRA-4315) can now authenticate **onboarding sessions** and **per-object client secrets**, matching the three-tier auth resolver of the native Frame iOS / Android SDKs (FRA-4712).

- **Onboarding sessions.** `FrameSDK` gains `setOnboardingSession(token)` and `clearOnboardingSession(token?)`. While a session is active, every request sends `Authorization: Bearer <token>` (e.g. `onb_sess_...`), overriding the configured publishable/secret keys regardless of `usePublishableKey`. Mirrors iOS `beginOnboardingSession` / `endOnboardingSession`. `clearOnboardingSession(token?)` is **safe-clear**: it only clears when `token` is omitted or matches the active token (so a stale unmount cannot wipe a newer session), returning `true`/`false` accordingly. Mirrors Android's guarded teardown.
- **Per-object client secrets.** `RequestOptions` gains `authToken?: string`, a per-request bearer override for sending an object `client_secret` (e.g. `ci_..._secret_...`) on charge-intent confirm/show and 3-D Secure. `chargeIntents.get` now accepts options; `threeDS.create/get/resend` now accept options.
- **Auth precedence** in the request interceptor is now exactly: per-request `authToken` > active onboarding-session token > publishable/secret key. The interceptor no longer unconditionally overwrites `Authorization` with the key-derived bearer — higher-precedence overrides win.
- **`usePublishableKey` coverage** added to the onboarding-flow methods: `threeDS.create/get/resend`, `termsOfService.createToken`, `capabilities.list/request`, and `onboardingSessions.create/getByAccount`.
- **Auth routing is carried on the axios request config, not on HTTP headers.** The per-request `authToken` (client_secret) and publishable-key flag travel as internal config fields that never serialize onto the wire, so the secret cannot leak as a header and a caller-supplied header cannot spoof key routing.
- **An explicitly empty `authToken` is rejected** with `code: 'invalid_auth_token'` instead of silently falling through to the session/publishable/secret key.

No breaking changes — all new parameters are optional and default to the prior behavior.

## 2.3.1

- `CreateSubscriptionParams.customer` is now optional, with `account` already optional, so subscriptions can be created against an account instead of a customer. The `/v1/subscriptions` API has accepted `account` for a while and enforces exactly-one-of (customer or account); the SDK type previously marked `customer` as required, blocking account-based subscriptions at compile time. Mirrors `CreateChargeIntentParams`.

## 2.1.5

Parity pass against Frame iOS 3.0.0 as the source-of-truth schema:

- **`ChargeIntentsAPI.capture(id, params?)`** now accepts an optional `{ amount_captured_cents }` body. Matches Frame-iOS `ChargeIntentsRequests.CaptureChargeIntentRequest`, enabling partial captures. Calling `capture(id)` with no params still captures the full authorized amount.
- **`AccountsAPI.getPaymentMethods(id)`** now returns the `{ meta?, data? }` envelope (`PaymentMethodListResponse`), matching Frame-iOS `PaymentMethodResponses.ListPaymentMethodsResponse`. **Breaking change** — callers that previously did `for (const pm of result)` should now do `for (const pm of result.data ?? [])`.
- **`Account.terms_of_service`** is now typed as the shared `TermsOfService` interface — `{ token?, ip_address?, accepted_at? }`, matching Frame-iOS `FrameObjects.AccountTermsOfService`. The previous shape's `accepted` boolean is dropped (not in iOS); `user_agent` is dropped from `TermsOfService` (also not in iOS); `token` is added.
- **`Account.payout_payment_method_id`** field removed — iOS does not model this field, so it was likely a Node-side hallucination.
- **`Account.metadata`** tightened from `Record<string, unknown>` to `Record<string, string>` to match Frame-iOS `[String: String]?`.
- **`Account.steps[].fields` / `.currently_due`** tightened from `unknown[]` to `string[]` to match Frame-iOS `[String]`.

## 2.1.4

- `ClientConfig` now accepts an optional `defaultHeaders: Record<string, string>` map. Headers in this map are attached to every outgoing request *before* the Authorization header is set, so they cannot override key routing. Per-call `headers` continue to take precedence. Used by `framepayments-react-native` to forward the device IP via `ip_address` on every call (matching the native Frame iOS / Frame Android behavior).

## 2.1.3

- `CreateACHPaymentMethodParams` now accepts an optional `account` field alongside `customer`. Matches the existing `CreateCardPaymentMethodParams` shape and lets mobile SDKs attach ACH methods to an account during onboarding without a customer association.

## 2.1.2

- `AccountsAPI.create`, `AccountsAPI.get`, `AccountsAPI.update`, and `AccountsAPI.getPlaidLinkToken` now accept an optional `RequestOptions` argument so mobile callers can route via `{ usePublishableKey: true }`. Matches the native iOS / Android SDKs which call these endpoints with the publishable key during onboarding.

## 2.1.1

- `TransfersAPI.create`, `ChargeIntentsAPI.create`, and `ChargeIntentsAPI.confirm` now accept an optional `RequestOptions` second argument so mobile callers can route via `{ usePublishableKey: true }`. Matches the native iOS / Android SDKs which call these endpoints with the publishable key.

## 2.1.0

This release lands the SDK surface that `framepayments-react-native@4.0.0` needs to ship its mobile UI without bundling the native Frame iOS / Android SDKs. Server callers that pass `{ apiKey }` today continue to work unchanged.

### New: per-call publishable-key routing

- `ClientConfig` now accepts `{ apiKey?, publishableKey? }` (one or both required). `apiKey` is your `sk_*` server-side key; `publishableKey` is your `pk_*` client-safe key. Mobile clients ship `publishableKey` only; server code keeps using `apiKey`.
- Every method that maps to a publishable-key endpoint on Frame's backend accepts an optional `{ usePublishableKey?: boolean }` final argument. Helpers `withPublishableKey()` and `maybePublishableKey()` are exported for callers that need to compose request configs directly.
- A clear `FrameAPIError` is thrown synchronously (as a promise rejection) when a call requests a key that wasn't configured (`missing_publishable_key` / `missing_api_key`).
- The interceptor also overrides any `Authorization` header callers try to set manually — there is no way to bypass key routing from outside the SDK.

### Security

- **`FrameAPIError.raw` is now sanitized on network-layer failures.** Previously, on any non-response error (DNS / ECONNRESET / TLS), the raw `AxiosError` was stashed wholesale — including `config.headers.Authorization: "Bearer sk_..."`. Anyone logging the error (Sentry, console, JSON.stringify) leaked the live key. Network-error `raw` now contains only `{ message, code, name, config }` with the Authorization header stripped.

### New: API classes

- **`ConfigurationAPI`** — `getEvervaultConfiguration()`, `getSiftConfiguration()`. Backs the Evervault card-encryption setup and Sift fraud-session setup that the mobile SDKs prefetch in `initialize()`. Defaults to **secret-key** auth (matches native iOS, which calls these on the secret path).
- **`DeviceAttestationAPI`** — `getChallenge()`, `attest({ key_id, attestation_object, challenge })`. iOS App Attest / Android Play Integrity round-trip. **Publishable-key** by default (matches native iOS).
- **`WalletAPI`** — `getGooglePayConfiguration()`. Returns the gateway processor + key + environment the Android SDK feeds into `PaymentDataRequest`. **Publishable-key** by default (matches native Android).
- **`GeoComplianceAPI`** — `getAccountStatus(accountId)`. Mirrors the iOS / Android `GeocomplianceAPI` for the onboarding flow. Defaults to **secret-key** auth (matches native). `listGeofences()` is on the existing `GeofencesAPI` — not duplicated.

### Extensions

- **`PaymentMethodsAPI`**
  - `createApplePayPaymentMethod(params, opts?)` — POST `/v1/payment_methods` with the Apple Pay wallet envelope (`_wallet.type === 'apple_pay'`) and the device-attest fields the backend requires. **Publishable-key** by default (matches native iOS `ApplePayAPI`).
  - `createGooglePayPaymentMethod(params, opts?)` — same endpoint with the `google_pay` wallet envelope. **Publishable-key** by default (matches native Android).
  - `connectPlaidBankAccount(params, opts?)` — alias for `connectPlaid` matching the native SDK naming.
  - All existing methods (`createCard`, `createACH`, `connectPlaid`, `update`, `attach`, …) now accept an optional `{ usePublishableKey: true }` opt-in for mobile clients.
- **`CustomerIdentityVerificationsAPI`**
  - `createForCustomer(customerId, opts?)` — customer-scoped identity verification creation.
  - `submitForVerification(id, opts?)` — submits a verification for review after documents have been uploaded.
  - `uploadIdentityDocuments(id, documents[], opts?)` — multipart upload accepting either Node `Buffer`/stream/path values or React Native `{ uri, type, name }` file descriptors. Runtime is detected via `navigator.product === 'ReactNative'`; on Node uses the `form-data` package, on RN uses `globalThis.FormData`. Default key is **secret** (matches native iOS).
- **`PhoneVerificationsAPI`**
  - `PhoneVerification` response now includes optional `prove_auth_token`. Mobile clients hand this off to the Prove SDK when present; otherwise they fall back to manual OTP entry.
  - `create()` and `confirm()` accept `{ usePublishableKey }`.

### Types

- New: `EvervaultConfiguration`, `SiftConfiguration`, `GooglePayConfiguration`, `ChallengeResponse`, `AttestRequest`, `AttestResponse`, `ApplePayPaymentDataHeader`, `ApplePayPaymentData`, `ApplePayPaymentMethodInfo`, `ApplePayToken`, `ApplePayBillingContact`, `ApplePayTokenDetails`, `ApplePayDetails`, `ApplePayWalletEnvelope`, `CreateApplePayPaymentMethodParams`, `GooglePayPaymentMethodData`, `GooglePayWalletData`, `GooglePayWalletEnvelope`, `CreateGooglePayPaymentMethodParams`, `IdentityDocumentUpload`, `ReactNativeFileDescriptor`, `NodeFilePayload`.
- Extended: `PhoneVerification.prove_auth_token?: string`.
- All new types are re-exported from the package root.
- `CreateApplePayPaymentMethodParams` and `CreateGooglePayPaymentMethodParams` use a discriminated `customer | account` union to enforce exactly-one ownership at the type level.
- Fixed: `PaymentMethod.livemode` is now `boolean` (was previously the boxed `Boolean` type).

### Internals

- Single shared axios instance per `FrameSDK` — the per-call key toggle is implemented via a request interceptor that rewrites the `Authorization` header based on a synthetic `X-Frame-Use-Publishable-Key` flag header that is stripped before the request leaves the SDK.
- Interceptor uses `AxiosHeaders.has()`/`.delete()` when available (modern axios) with a property-access fallback for older configs.

### Notes

- `prove_auth_token` on the phone-verification response is currently a frame-node-only field — the native iOS / Android SDKs don't surface it yet. Confirm with the backend team that the field actually appears in `/v1/accounts/{id}/phone_verifications` responses before relying on it in production.

## 2.0.x

Prior versions — see git history.
