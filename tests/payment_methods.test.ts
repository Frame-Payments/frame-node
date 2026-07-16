/// <reference types="jest" />

import { PaymentMethodsAPI } from '../src/api/payment_methods-api';
import { 
  CreateCardPaymentMethodParams, 
  CreateACHPaymentMethodParams, 
  PaymentAccountType, 
  PaymentMethodType, 
  PaymentMethod,
  PaymentMethodStatus
} from '../src/types/payment_methods';
import nock from 'nock';
import { createApiClient } from '../src/client';

const baseUrl = 'https://api.framepayments.com';
const client = createApiClient({ apiKey: 'sk_test', publishableKey: 'pk_test' });
const paymentMethods = new PaymentMethodsAPI(client);

const mockPaymentMethod: PaymentMethod = {
  id: 'pm_123',
  customer: 'cus_abc',
  type: PaymentMethodType.CARD,
  status: PaymentMethodStatus.ACTIVE,
  created: 1234567890,
  updated: 1234567890,
  livemode: false,
  object: 'payment_method'
};

const mockACHPaymentMethod: PaymentMethod = {
  id: 'pm_123',
  customer: 'cus_abc',
  type: PaymentMethodType.ACH,
  status: PaymentMethodStatus.ACTIVE,
  created: 1234567890,
  updated: 1234567890,
  livemode: false,
  object: 'payment_method'
};

test('create card payment method', async () => {
  const input: CreateCardPaymentMethodParams = {
    type: PaymentMethodType.CARD,
    card_number: '2121212121212121',
    exp_month: '02',
    exp_year: '26',
    cvc: '234'
   };
  nock(baseUrl).post('/v1/payment_methods').reply(200, mockPaymentMethod);

  const result = await paymentMethods.createCard(input as any);
  expect(result).toEqual(mockPaymentMethod);
});

test('create ach payment method', async () => {
  const input: CreateACHPaymentMethodParams = {
      type: PaymentMethodType.ACH,
      account_type: PaymentAccountType.CHECKING,
      account_number: '1234567890123',
      routing_number: '123123123'
   };
  nock(baseUrl).post('/v1/payment_methods').reply(200, mockACHPaymentMethod);

  const result = await paymentMethods.createACH(input as any);
  expect(result).toEqual(mockACHPaymentMethod);
});

test('get payment method', async () => {
  nock(baseUrl).get('/v1/payment_methods/pm_123').reply(200, mockPaymentMethod);

  const result = await paymentMethods.get('pm_123');
  expect(result).toEqual(mockPaymentMethod);
});

test('retrieve payment method', async () => {
  nock(baseUrl).get('/v1/payment_methods/pm_123').reply(200, mockPaymentMethod);

  const result = await paymentMethods.retrieve('pm_123');
  expect(result).toEqual(mockPaymentMethod);
});

test('list payment methods', async () => {
  const response = {
    data: [mockPaymentMethod],
    page: 1,
    per_page: 20,
    total: 1
  };

  nock(baseUrl)
    .get('/v1/payment_methods')
    .query({ per_page: 20, page: 1 })
    .reply(200, response);

  const result = await paymentMethods.list(20, 1);
  expect(result).toEqual(response);
});

test('update payment method', async () => {
  const updates = { metadata: { note: 'test' } };
  const updatedResponse = { ...mockPaymentMethod, ...updates };

  nock(baseUrl).patch('/v1/payment_methods/pm_123', updates).reply(200, updatedResponse);

  const result = await paymentMethods.update('pm_123', updates as any);
  expect(result).toEqual(updatedResponse);
});

test('attach payment method to customer', async () => {
  nock(baseUrl)
    .post('/v1/payment_methods/pm_123/attach', { customer: 'cus_abc' })
    .reply(200, mockPaymentMethod);

  const result = await paymentMethods.attach('pm_123', 'cus_abc');
  expect(result).toEqual(mockPaymentMethod);
});

test('detach payment method', async () => {
  nock(baseUrl)
    .post('/v1/payment_methods/pm_123/detach')
    .reply(200, mockPaymentMethod);

  const result = await paymentMethods.detach('pm_123');
  expect(result).toEqual(mockPaymentMethod);
});

test('block payment method', async () => {
  nock(baseUrl)
    .post('/v1/payment_methods/pm_123/block')
    .reply(200, mockPaymentMethod);

  const result = await paymentMethods.block('pm_123');
  expect(result).toEqual(mockPaymentMethod);
});

test('unblock payment method', async () => {
  nock(baseUrl)
    .post('/v1/payment_methods/pm_123/unblock')
    .reply(200, mockPaymentMethod);

  const result = await paymentMethods.unblock('pm_123');
  expect(result).toEqual(mockPaymentMethod);
});

test('connect plaid payment method', async () => {
  const params = {
    account: 'acct_123',
    public_token: 'public-sandbox-abc123',
    account_id: 'plaid_acct_456',
  };

  nock(baseUrl)
    .post('/v1/payment_methods/connect_plaid', params)
    .reply(200, mockPaymentMethod);

  const result = await paymentMethods.connectPlaid(params);
  expect(result).toEqual(mockPaymentMethod);
});

test('connectPlaidBankAccount alias hits same endpoint', async () => {
  const params = {
    account: 'acct_123',
    public_token: 'public-sandbox-abc123',
    account_id: 'plaid_acct_456',
  };

  nock(baseUrl).post('/v1/payment_methods/connect_plaid', params).reply(200, mockPaymentMethod);

  const result = await paymentMethods.connectPlaidBankAccount(params);
  expect(result).toEqual(mockPaymentMethod);
});

test('createApplePayPaymentMethod → POST /v1/payment_methods with wallet envelope', async () => {
  const params = {
    type: 'card' as const,
    customer: 'cus_abc',
    _wallet: {
      type: 'apple_pay' as const,
      apple_pay: {
        requestId: 'req_1',
        methodName: 'https://apple.com/apple-pay' as const,
        details: {
          token: {
            paymentData: {
              version: 'EC_v1',
              data: 'opaque',
              signature: 'sig',
              header: { ephemeralPublicKey: 'epk', publicKeyHash: 'pkh', transactionId: 'txn_1' },
            },
            paymentMethod: { displayName: 'Visa', network: 'Visa', type: 'credit' },
            transactionIdentifier: 'txn_1',
          },
        },
      },
    },
  };

  nock(baseUrl, { reqheaders: { authorization: 'Bearer pk_test' } })
    .post('/v1/payment_methods', (body) => body._wallet?.type === 'apple_pay')
    .reply(200, mockPaymentMethod);

  const result = await paymentMethods.createApplePayPaymentMethod(params);
  expect(result).toEqual(mockPaymentMethod);
});

test('createGooglePayPaymentMethod → POST /v1/payment_methods with wallet envelope', async () => {
  const params = {
    type: 'card' as const,
    account: 'acct_123',
    _wallet: {
      type: 'google_pay' as const,
      google_pay: {
        apiVersion: 2,
        apiVersionMinor: 0,
        email: null,
        paymentMethodData: { tokenizationData: { token: '{}' } } as Record<string, unknown>,
      },
    },
  };

  nock(baseUrl, { reqheaders: { authorization: 'Bearer pk_test' } })
    .post('/v1/payment_methods', (body) => body._wallet?.type === 'google_pay')
    .reply(200, mockPaymentMethod);

  const result = await paymentMethods.createGooglePayPaymentMethod(params);
  expect(result).toEqual(mockPaymentMethod);
});

test('createCard honors usePublishableKey opt-in', async () => {
  const input: CreateCardPaymentMethodParams = {
    type: PaymentMethodType.CARD,
    card_number: '4242424242424242',
    exp_month: '12',
    exp_year: '30',
    cvc: '123',
  };

  nock(baseUrl, { reqheaders: { authorization: 'Bearer pk_test' } })
    .post('/v1/payment_methods')
    .reply(200, mockPaymentMethod);

  await paymentMethods.createCard(input, { usePublishableKey: true });
});