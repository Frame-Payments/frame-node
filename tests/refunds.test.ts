/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { RefundsAPI } from '../src/api/refunds-api';
import type { Refund } from '../src/types/refunds';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const refunds = new RefundsAPI(client);

const mockRefund: Refund = {
    id: 're_123',
    currency: 'usd',
    status: 'succeeded',
    amount: 1234,
    reason: 'fraudulent',
    charge_intent: 'ch_123',
    object: 'n/a',
    livemode: true,
    created: 123456789,
    updated: 123456789,
}

test('create refund', async () => {
  const input = { charge: 'ch_123', amount: 1000 };

  nock(baseUrl).post('/v1/refunds', input).reply(200, mockRefund);

  const result = await refunds.create(input as any);
  expect(result).toEqual(mockRefund);
});

test('get refund', async () => {
  nock(baseUrl).get('/v1/refunds/re_123').reply(200, mockRefund);

  const result = await refunds.get('re_123');
  expect(result).toEqual(mockRefund);
});

test('list refunds', async () => {
  const response = {
    data: [mockRefund],
    page: 1,
    per_page: 10,
    total: 1,
  };

  nock(baseUrl).get('/v1/refunds').query({ per_page: 10, page: 1 }).reply(200, response);

  const result = await refunds.list(10, 1);
  expect(result).toEqual(response);
});

test('cancel refund', async () => {
  nock(baseUrl).post('/v1/refunds/re_123/cancel').reply(200, mockRefund);

  const result = await refunds.cancel('re_123');
  expect(result).toEqual(mockRefund);
});