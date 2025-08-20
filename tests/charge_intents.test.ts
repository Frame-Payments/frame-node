/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { ChargeIntentsAPI } from '../src/api/charge_intents-api'; // adjust path
import type { ChargeIntent } from '../src/types/charge_intents'; // adjust path if needed
 // adjust path if needed

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const chargeIntents = new ChargeIntentsAPI(client);

const mockChargeIntent: ChargeIntent = {
  id: 'ci_123',
  amount: 1500,
  currency: 'usd',
  status: 'pending',
  object: 'charge_intent',
  customer: 'cus_123',
  created: 1234567890,
  updated: 1234567890,
  livemode: false,
  metadata: {}
};

test('create charge intent', async () => {
  const input = { amount: 1500, currency: 'usd' };

  nock(baseUrl).post('/v1/charge_intents', input).reply(200, mockChargeIntent);

  const result = await chargeIntents.create(input as any);
  expect(result).toEqual(mockChargeIntent);
});

test('update charge intent', async () => {
  const updates = { metadata: { updated_by: 'admin' } };

  nock(baseUrl).patch('/v1/charge_intents/ci_123', updates).reply(200, mockChargeIntent);

  const result = await chargeIntents.update('ci_123', updates as any);
  expect(result).toEqual(mockChargeIntent);
});

test('get charge intent', async () => {
  nock(baseUrl).get('/v1/charge_intents/ci_123').reply(200, mockChargeIntent);

  const result = await chargeIntents.get('ci_123');
  expect(result).toEqual(mockChargeIntent);
});

test('list charge intents', async () => {
  const response = {
    data: [mockChargeIntent],
    page: 1,
    per_page: 10,
    total: 1,
  };

  nock(baseUrl).get('/v1/charge_intents').query({ per_page: 10, page: 1 }).reply(200, response);

  const result = await chargeIntents.list(10, 1);
  expect(result).toEqual(response);
});

test('cancel charge intent', async () => {
  nock(baseUrl).post('/v1/charge_intents/ci_123/cancel').reply(200, mockChargeIntent);

  const result = await chargeIntents.cancel('ci_123');
  expect(result).toEqual(mockChargeIntent);
});

test('confirm charge intent', async () => {
  nock(baseUrl).post('/v1/charge_intents/ci_123/confirm').reply(200, mockChargeIntent);

  const result = await chargeIntents.confirm('ci_123');
  expect(result).toEqual(mockChargeIntent);
});

test('capture charge intent', async () => {
  nock(baseUrl).post('/v1/charge_intents/ci_123/capture').reply(200, mockChargeIntent);

  const result = await chargeIntents.capture('ci_123');
  expect(result).toEqual(mockChargeIntent);
});