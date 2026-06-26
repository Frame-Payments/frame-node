/// <reference types="jest" />

import nock from 'nock';
import { FrameSDK } from '../src/index';

const baseUrl = 'https://api.framepayments.com';

afterEach(() => nock.cleanAll());

describe('FrameSDK constructor', () => {
  test('instantiates every documented sub-API without throwing', () => {
    const sdk = new FrameSDK({ apiKey: 'sk_test', publishableKey: 'pk_test' });

    const expectedNamespaces = [
      'accounts',
      'capabilities',
      'onboardingSessions',
      'customers',
      'paymentMethods',
      'chargeIntents',
      'refunds',
      'subscriptions',
      'customerIdentityVerifications',
      'subscriptionPhases',
      'invoices',
      'invoiceLineItems',
      'disputes',
      'products',
      'charges',
      'chargeSessions',
      'sonarSessions',
      'phoneVerifications',
      'geofences',
      'webhookEndpoints',
      'payouts',
      'transfers',
      'transferFeePlans',
      'transferBillingAgreements',
      'coupons',
      'promotionCodes',
      'discounts',
      'paymentLinkSessions',
      'subscriptionChangeLogs',
      'billing',
      'threeDS',
      'productPhases',
      'termsOfService',
      'onboarding',
      'configuration',
      'deviceAttestation',
      'wallet',
      'geoCompliance',
    ];

    for (const name of expectedNamespaces) {
      expect((sdk as unknown as Record<string, unknown>)[name]).toBeDefined();
    }
  });

  test('full SDK construction with publishable key only — secret-keyed endpoint throws missing_api_key', async () => {
    const sdk = new FrameSDK({ publishableKey: 'pk_test' });

    await expect(sdk.customers.list({})).rejects.toMatchObject({
      code: 'missing_api_key',
    });
  });

  test('full SDK construction with publishable key — Apple Pay creation routes via pk', async () => {
    const sdk = new FrameSDK({ publishableKey: 'pk_apple' });

    nock(baseUrl, {
      reqheaders: { authorization: 'Bearer pk_apple' },
    })
      .post('/v1/payment_methods')
      .reply(200, { id: 'pm_1', type: 'card' });

    const result = await sdk.paymentMethods.createApplePayPaymentMethod({
      type: 'card',
      customer: 'cus_1',
      _wallet: {
        type: 'apple_pay',
        apple_pay: {
          requestId: 'req_1',
          methodName: 'https://apple.com/apple-pay',
          details: {
            token: {
              paymentData: {
                version: 'EC_v1',
                data: 'd',
                signature: 's',
                header: { ephemeralPublicKey: 'e', publicKeyHash: 'p', transactionId: 't' },
              },
              paymentMethod: { displayName: 'Visa', network: 'Visa', type: 'credit' },
              transactionIdentifier: 't',
            },
          },
        },
      },
    });
    expect(result).toMatchObject({ id: 'pm_1' });
  });

  test('full SDK construction with secret key only — publishable-keyed endpoint throws missing_publishable_key', async () => {
    const sdk = new FrameSDK({ apiKey: 'sk_test' });

    await expect(sdk.deviceAttestation.getChallenge()).rejects.toMatchObject({
      code: 'missing_publishable_key',
    });
  });

  test('full SDK construction with both keys routes secret + publishable to the right endpoints', async () => {
    const sdk = new FrameSDK({ apiKey: 'sk_a', publishableKey: 'pk_a' });

    nock(baseUrl, { reqheaders: { authorization: 'Bearer sk_a' } })
      .get('/v1/customers')
      .reply(200, { meta: { page: 1, per_page: 20 }, data: [] });

    nock(baseUrl, { reqheaders: { authorization: 'Bearer pk_a' } })
      .get('/v1/client/wallet/google_pay')
      .reply(200, { processor: 'stripe' });

    await sdk.customers.list({});
    const wallet = await sdk.wallet.getGooglePayConfiguration();
    expect(wallet).toEqual({ processor: 'stripe' });
  });
});

describe('FrameSDK onboarding session — bearer override', () => {
  test('setOnboardingSession routes every request through the session token, ignoring pk/sk', async () => {
    const sdk = new FrameSDK({ publishableKey: 'pk_test' });
    sdk.setOnboardingSession('onb_sess_abc');

    nock(baseUrl, { reqheaders: { authorization: 'Bearer onb_sess_abc' } })
      .post('/v1/onboarding_sessions')
      .reply(200, { id: 'onb_1' });

    const result = await sdk.onboardingSessions.create({} as never);
    expect(result).toMatchObject({ id: 'onb_1' });
  });

  test('clearOnboardingSession() reverts to the publishable key', async () => {
    const sdk = new FrameSDK({ publishableKey: 'pk_test' });
    sdk.setOnboardingSession('onb_sess_abc');
    expect(sdk.clearOnboardingSession()).toBe(true);

    nock(baseUrl, { reqheaders: { authorization: 'Bearer pk_test' } })
      .post('/v1/terms_of_service')
      .reply(200, { token: 'tos_1' });

    const result = await sdk.termsOfService.createToken({ usePublishableKey: true });
    expect(result).toMatchObject({ token: 'tos_1' });
  });

  test('clearOnboardingSession(token) is a no-op when the token does not match (safe-clear)', async () => {
    const sdk = new FrameSDK({ publishableKey: 'pk_test' });
    sdk.setOnboardingSession('onb_sess_new');

    // A stale unmount tries to clear an older session.
    expect(sdk.clearOnboardingSession('onb_sess_old')).toBe(false);

    // The newer session is still active.
    nock(baseUrl, { reqheaders: { authorization: 'Bearer onb_sess_new' } })
      .post('/v1/onboarding_sessions')
      .reply(200, { id: 'onb_2' });

    await sdk.onboardingSessions.create({} as never);
  });

  test('clearOnboardingSession(token) clears when the token matches', () => {
    const sdk = new FrameSDK({ publishableKey: 'pk_test' });
    sdk.setOnboardingSession('onb_sess_match');
    expect(sdk.clearOnboardingSession('onb_sess_match')).toBe(true);
    // Clearing again is a no-op (already null, provided token won't match null).
    expect(sdk.clearOnboardingSession('onb_sess_match')).toBe(false);
  });

  test('setOnboardingSession replaces a prior session token', async () => {
    const sdk = new FrameSDK({ publishableKey: 'pk_test' });
    sdk.setOnboardingSession('onb_sess_1');
    sdk.setOnboardingSession('onb_sess_2');

    nock(baseUrl, { reqheaders: { authorization: 'Bearer onb_sess_2' } })
      .post('/v1/onboarding_sessions')
      .reply(200, { id: 'onb_3' });

    await sdk.onboardingSessions.create({} as never);
  });
});

describe('FrameSDK per-request client_secret bearer', () => {
  test('chargeIntents.confirm sends the client_secret as bearer and wins over an active session', async () => {
    const sdk = new FrameSDK({ publishableKey: 'pk_test' });
    sdk.setOnboardingSession('onb_sess_abc');

    nock(baseUrl, { reqheaders: { authorization: 'Bearer ci_9_secret_xyz' } })
      .post('/v1/charge_intents/ci_9/confirm')
      .reply(200, { id: 'ci_9' });

    const result = await sdk.chargeIntents.confirm('ci_9', { authToken: 'ci_9_secret_xyz' });
    expect(result).toMatchObject({ id: 'ci_9' });
  });

  test('chargeIntents.get accepts a per-request authToken', async () => {
    const sdk = new FrameSDK({ publishableKey: 'pk_test' });

    nock(baseUrl, { reqheaders: { authorization: 'Bearer ci_9_secret_xyz' } })
      .get('/v1/charge_intents/ci_9')
      .reply(200, { id: 'ci_9' });

    const result = await sdk.chargeIntents.get('ci_9', { authToken: 'ci_9_secret_xyz' });
    expect(result).toMatchObject({ id: 'ci_9' });
  });

  test('threeDS.get accepts a per-request authToken', async () => {
    const sdk = new FrameSDK({ publishableKey: 'pk_test' });

    nock(baseUrl, { reqheaders: { authorization: 'Bearer tds_secret_xyz' } })
      .get('/v1/3ds/intents/tds_1')
      .reply(200, { id: 'tds_1' });

    const result = await sdk.threeDS.get('tds_1', { authToken: 'tds_secret_xyz' });
    expect(result).toMatchObject({ id: 'tds_1' });
  });
});
