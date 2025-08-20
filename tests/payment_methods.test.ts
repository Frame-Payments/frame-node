/// <reference types="jest" />

import { PaymentMethodsAPI } from '../src/api/payment_methods-api';
import nock from 'nock';
import axios from 'axios';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const paymentMethods = new PaymentMethodsAPI(client);

const mockPaymentMethod = {
  id: 'pm_123',
  customer: 'cus_abc',
  type: 'card',
  status: 'active',
  created: 1234567890,
  updated: 1234567890,
  livemode: false,
  metadata: {},
  object: 'payment_method'
};

test('create payment method', async () => {
  const input = { type: 'card', customer: 'cus_abc' };
  nock(baseUrl).post('/v1/payment_methods', input).reply(200, mockPaymentMethod);

  const result = await paymentMethods.create(input as any);
  expect(result).toEqual(mockPaymentMethod);
});

test('get payment method', async () => {
  nock(baseUrl).get('/v1/payment_methods/pm_123').reply(200, mockPaymentMethod);

  const result = await paymentMethods.get('pm_123');
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