/// <reference types="jest" />

import { SubscriptionsAPI } from '../src/api/subscriptions-api';
import nock from 'nock';
import axios from 'axios';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const subscriptions = new SubscriptionsAPI(client);

const mockSubscription = {
  id: 'sub_123',
  customer: 'cus_abc',
  status: 'active',
  object: 'subscription',
  created: 1234567890,
  updated: 1234567890,
  livemode: false,
  metadata: {},
  current_phase: null,
};

test('create subscription', async () => {
  const input = { customer: 'cus_abc', price: 'price_123' };

  nock(baseUrl).post('/v1/subscriptions', input).reply(200, mockSubscription);

  const result = await subscriptions.create(input as any);
  expect(result).toEqual(mockSubscription);
});

test('get subscription', async () => {
  nock(baseUrl).get('/v1/subscriptions/sub_123').reply(200, mockSubscription);

  const result = await subscriptions.get('sub_123');
  expect(result).toEqual(mockSubscription);
});

test('update subscription', async () => {
  const updates = { metadata: { updated: true } };
  const updated = { ...mockSubscription, ...updates };

  nock(baseUrl).patch('/v1/subscriptions/sub_123', updates).reply(200, updated);

  const result = await subscriptions.update('sub_123', updates as any);
  expect(result).toEqual(updated);
});

test('list subscriptions', async () => {
  const response = {
    data: [mockSubscription],
    page: 1,
    per_page: 20,
    total: 1,
  };

  nock(baseUrl)
    .get('/v1/subscriptions')
    .query({ per_page: 20, page: 1 })
    .reply(200, response);

  const result = await subscriptions.list(20, 1);
  expect(result).toEqual(response);
});

test('search subscriptions', async () => {
  const query = { customer: 'cus_abc' };
  const response = {
    data: [mockSubscription],
    page: 1,
    per_page: 20,
    total: 1,
  };

  nock(baseUrl)
    .get('/v1/subscriptions/search')
    .query(query)
    .reply(200, response);

  const result = await subscriptions.search(query as any);
  expect(result).toEqual(response);
});

test('cancel subscription', async () => {
  nock(baseUrl).post('/v1/subscriptions/sub_123/cancel').reply(200, mockSubscription);

  const result = await subscriptions.cancel('sub_123');
  expect(result).toEqual(mockSubscription);
});