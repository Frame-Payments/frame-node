/// <reference types="jest" />

import { SubscriptionsAPI } from '../src/api/subscriptions-api';
import nock from 'nock';
import axios from 'axios';
import { Subscription, SubscriptionStatus } from '../src/types/subscriptions';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const subscriptions = new SubscriptionsAPI(client);

const mockSubscription: Subscription = {
  id: 'sub_123',
  customer: 'cus_abc',
  status: SubscriptionStatus.ACTIVE,
  object: 'subscription',
  created: 1234567890,
  updated: 1234567890,
  livemode: false,
  metadata: {},
  description: undefined,
  current_period_start: undefined,
  current_period_end: undefined,
  currency: 'usd',
  default_payment_method: undefined,
  plan: undefined,
  start_date: undefined,
};

test('create subscription', async () => {
  const input = { customer: 'cus_abc', price: 'price_123' };

  nock(baseUrl).post('/v1/subscriptions', input).reply(200, mockSubscription);

  const result = await subscriptions.create(input as any);
  expect(result).toEqual(mockSubscription);
});

test('create account-based subscription', async () => {
  const input = {
    account: 'acct_abc',
    product: 'prod_123',
    currency: 'usd',
    default_payment_method: 'pm_123',
  };
  const accountSubscription = {
    ...mockSubscription,
    customer: undefined,
    account: 'acct_abc',
  };

  nock(baseUrl).post('/v1/subscriptions', input).reply(200, accountSubscription);

  const result = await subscriptions.create(input);
  expect(result).toEqual(accountSubscription);
});

test('get subscription', async () => {
  nock(baseUrl).get('/v1/subscriptions/sub_123').reply(200, mockSubscription);

  const result = await subscriptions.get('sub_123');
  expect(result).toEqual(mockSubscription);
});

test('retrieve subscription', async () => {
  nock(baseUrl).get('/v1/subscriptions/sub_123').reply(200, mockSubscription);

  const result = await subscriptions.retrieve('sub_123');
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

test('pause subscription', async () => {
  nock(baseUrl).post('/v1/subscriptions/sub_123/pause').reply(200, mockSubscription);

  const result = await subscriptions.pause('sub_123');
  expect(result).toEqual(mockSubscription);
});

test('resume subscription', async () => {
  nock(baseUrl).post('/v1/subscriptions/sub_123/resume').reply(200, mockSubscription);

  const result = await subscriptions.resume('sub_123');
  expect(result).toEqual(mockSubscription);
});

const mockScheduledChange = {
  id: 'ssc_123',
  object: 'subscription_scheduled_change',
  product: 'prod_456',
  interval_switch: false,
  effective_date: 1234599999,
  created: 1234567890,
};

test('cancelScheduledChange clears the pending scheduled change', async () => {
  const cleared: Subscription = { ...mockSubscription, scheduled_change: null };

  nock(baseUrl)
    .delete('/v1/subscriptions/sub_123/scheduled_change')
    .reply(200, cleared);

  const result = await subscriptions.cancelScheduledChange('sub_123');
  expect(result).toEqual(cleared);
  expect(result.scheduled_change).toBeNull();
});

test('subscription deserializes a populated scheduled_change', async () => {
  const subWithChange: Subscription = {
    ...mockSubscription,
    scheduled_change: mockScheduledChange,
  };

  nock(baseUrl).get('/v1/subscriptions/sub_123').reply(200, subWithChange);

  const result = await subscriptions.retrieve('sub_123');
  expect(result).toEqual(subWithChange);
  expect(result.scheduled_change).toEqual(mockScheduledChange);
});