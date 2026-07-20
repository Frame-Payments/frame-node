/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { PayoutsAPI } from '../src/api/payouts-api';
import type { Payout, CreatePayoutParams } from '../src/types/payouts';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const payouts = new PayoutsAPI(client);

const mockPayout: Payout = {
  id: 'po_123',
  object: 'payout',
  amount: 5000,
  currency: 'usd',
  status: 'pending',
  payment_method_id: 'pm_dst_456',
  account_id: 'acct_123',
  metadata: {},
  created: 1713435744,
  updated: 1713435744,
  livemode: true,
};

afterEach(() => nock.cleanAll());

test('create payout - merchant earnings withdrawal', async () => {
  const input: CreatePayoutParams = {
    amount: 5000,
    currency: 'usd',
    payment_method_id: 'pm_dst_456',
  };

  nock(baseUrl).post('/v1/payouts', input as any).reply(200, mockPayout);

  const result = await payouts.create(input);
  expect(result).toEqual(mockPayout);
});

test('create payout - with metadata', async () => {
  const input: CreatePayoutParams = {
    amount: 5000,
    currency: 'usd',
    payment_method_id: 'pm_dst_456',
    metadata: { invoice: 'inv_789' },
  };

  const expected: Payout = {
    ...mockPayout,
    metadata: { invoice: 'inv_789' },
  };

  nock(baseUrl).post('/v1/payouts', input as any).reply(200, expected);

  const result = await payouts.create(input);
  expect(result).toEqual(expected);
});
