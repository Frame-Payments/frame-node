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
