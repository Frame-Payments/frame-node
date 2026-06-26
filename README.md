# Frame-Node.js Library
The Frame Node.js Library simplifies the process of creating a seamless payment experience within your web app or mobile client. It provides direct access to the underlying APIs that drive these components, allowing you to design fully customized payment workflows tailored to your app's needs.

## 📦 Installation

```bash
npm install framepayments
# or
yarn add framepayments
```

## 🤖 Server-side usage

1. Initialize the client with your API key. You'll need your developer secret key from Frame; if you don't already have one you can sign up at https://www.framepayments.com.

```ts
import { FrameSDK } from 'framepayments';

const frame = new FrameSDK({
  apiKey: 'sk_...', // your Frame secret API key
});
```

2. Access API endpoints directly using available types and dot notation. For the full list see https://docs.framepayments.com.

```ts
const newCustomer = await frame.customers.create({
  name: 'Alice Johnson',
  email: 'alice@example.com',
});
console.log(newCustomer.id); // e.g. cust_abc123

const subscription = await frame.subscriptions.create({
  customer: 'cust_abc123',
  plan: 'plan_basic_monthly',
});
console.log(subscription.status); // e.g. active
```

### Local development against a self-hosted Frame OS

Frame engineers can point the SDK at a local Frame OS instance (e.g. served by puma-dev as `http://api.framepayments.test`) by passing `baseURL`:

```ts
const frame = new FrameSDK({
  apiKey: 'sk_...',
  baseURL: 'http://api.framepayments.test',
});
```

`baseURL` is optional. When omitted, the SDK defaults to `https://api.framepayments.com`, so existing integrations are unaffected.

## 📱 Client-side (mobile) usage

For mobile clients running on Frame's React Native SDK (`framepayments-react-native@4+`), initialize with the **publishable** key only and call publishable-keyed endpoints:

```ts
import { FrameSDK } from 'framepayments';

const frame = new FrameSDK({
  publishableKey: 'pk_...', // safe to ship on-device
});

// Apple Pay / Google Pay / device attestation / wallet config / Apple Pay
// payment-method creation all accept the publishable key.
const challenge = await frame.deviceAttestation.getChallenge();
const wallet = await frame.wallet.getGooglePayConfiguration();
```

Any call to a secret-keyed endpoint from a publishable-only client will throw a `FrameAPIError` with `code: 'missing_api_key'` before the request hits the network.

## 🔑 Per-call key routing

Some endpoints (configuration, document upload, geo-compliance, phone verification) default to the secret key but can be invoked over the publishable key when called from a mobile client. Pass `{ usePublishableKey: true }` as the final argument:

```ts
// Server-side: default secret-key path
await frame.configuration.getEvervaultConfiguration();

// Mobile: publishable-key path
await frame.configuration.getEvervaultConfiguration({ usePublishableKey: true });
```

The SDK defaults match the native Frame iOS / Android SDKs exactly — endpoints that those SDKs invoke with `usePublishableKey: true` are publishable-by-default here as well (`paymentMethods.createApplePayPaymentMethod`, `paymentMethods.createGooglePayPaymentMethod`, `deviceAttestation.*`, `wallet.getGooglePayConfiguration`). Everything else defaults to secret.

## 🪪 Onboarding sessions & per-object client secrets

Publishable-key-only mobile clients can authenticate **onboarding sessions** and **per-object client secrets**, matching the three-tier auth model of the native Frame iOS / Android SDKs. The bearer for any request is resolved in this precedence order:

1. a per-request `authToken` (an object `client_secret`, e.g. `ci_..._secret_...`), else
2. the active onboarding-session token (e.g. `onb_sess_...`), else
3. the publishable key (when `usePublishableKey: true`) or the secret key.

### Onboarding sessions

Begin a session to route **every** request through the session token, overriding the configured keys (and ignoring `usePublishableKey`) while it is active. Mirrors iOS `beginOnboardingSession` / `endOnboardingSession`.

```ts
const frame = new FrameSDK({ publishableKey: 'pk_...' });

frame.setOnboardingSession('onb_sess_...');
// Every call now sends `Authorization: Bearer onb_sess_...`.
await frame.onboardingSessions.create({ /* ... */ });
await frame.termsOfService.createToken();

// End the session, reverting to the publishable key.
frame.clearOnboardingSession();
```

`clearOnboardingSession(token?)` is **safe-clear**: passing a `token` only clears the session when it matches the active one (so a stale unmount can't wipe a newer session), and returns `true` if it cleared / `false` if the guard prevented it. Omit the argument to force-clear.

### Per-object client secrets

For charge-intent confirm/show and 3-D Secure, pass the object's `client_secret` as a per-request `authToken`. It wins over both an active session and the configured keys:

```ts
await frame.chargeIntents.confirm('ci_123', { authToken: 'ci_123_secret_...' });
await frame.chargeIntents.get('ci_123', { authToken: 'ci_123_secret_...' });
await frame.threeDS.get('tds_123', { authToken: 'tds_123_secret_...' });
```

## 📚 Available APIs

| Namespace | Purpose |
| --- | --- |
| `accounts`, `capabilities`, `customers`, `customerIdentityVerifications` | Identity & onboarding |
| `paymentMethods`, `chargeIntents`, `charges`, `chargeSessions`, `transfers` | Payments |
| `applePay` (via `paymentMethods.createApplePayPaymentMethod`), `wallet`, `deviceAttestation` | Apple Pay / Google Pay / attestation flows |
| `refunds`, `disputes`, `threeDS` | Refunds, chargebacks, 3-D Secure |
| `subscriptions`, `subscriptionPhases`, `subscriptionChangeLogs`, `coupons`, `promotionCodes`, `discounts` | Recurring billing |
| `invoices`, `invoiceLineItems`, `products`, `productPhases`, `transferFeePlans`, `transferBillingAgreements`, `paymentLinkSessions`, `billing` | Invoicing & monetization |
| `geofences`, `geoCompliance`, `sonarSessions`, `phoneVerifications`, `webhookEndpoints`, `payouts`, `configuration`, `onboarding`, `onboardingSessions`, `termsOfService` | Compliance, fraud, configuration |

## 🔒 Privacy

Our privacy policy can be found at https://framepayments.com/privacy.
