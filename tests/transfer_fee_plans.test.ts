/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { TransferFeePlansAPI } from '../src/api/transfer_fee_plans-api';
import type { TransferFeePlan, CreateTransferFeePlanParams } from '../src/types/transfer_fee_plans';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const transferFeePlans = new TransferFeePlansAPI(client);

const mockFeePlan: TransferFeePlan = {
  id: 'tfp_123',
  object: 'transfer_fee_plan',
  name: 'Standard Plan',
  fee_application_mode: 'deduct',
  items: [
    {
      id: 'tfpi_123',
      object: 'transfer_fee_plan_item',
      fee_type: 'flat_plus_percentage',
      amount_fixed_cents: 30,
      amount_fixed_currency: 'usd',
      amount_percentage: '2.9',
      billable_event_type: 'charge',
      created: 1713435744,
      updated: 1713435744,
    },
  ],
  livemode: false,
  created: 1713435744,
  updated: 1713435744,
};

const listMeta = {
  page: 1,
  has_more: false,
  url: '/v1/transfer_fee_plans',
  next: null,
  prev: null,
};

afterEach(() => nock.cleanAll());

test('create transfer fee plan', async () => {
  const input: CreateTransferFeePlanParams = {
    name: 'Standard Plan',
    fee_application_mode: 'deduct',
    items: [
      {
        fee_type: 'flat_plus_percentage',
        amount_fixed_cents: 30,
        amount_fixed_currency: 'usd',
        amount_percentage: 2.9,
        billable_event_type: 'charge',
      },
    ],
  };

  nock(baseUrl).post('/v1/transfer_fee_plans', input as any).reply(200, mockFeePlan);

  const result = await transferFeePlans.create(input);
  expect(result).toEqual(mockFeePlan);
});

test('get transfer fee plan', async () => {
  nock(baseUrl).get('/v1/transfer_fee_plans/tfp_123').reply(200, mockFeePlan);

  const result = await transferFeePlans.get('tfp_123');
  expect(result).toEqual(mockFeePlan);
});

test('list transfer fee plans', async () => {
  const response = { data: [mockFeePlan], meta: listMeta };

  nock(baseUrl)
    .get('/v1/transfer_fee_plans')
    .query({ per_page: 10, page: 1 })
    .reply(200, response);

  const result = await transferFeePlans.list(10, 1);
  expect(result).toEqual(response);
});

test('iterate all transfer fee plans across pages', async () => {
  nock(baseUrl)
    .get('/v1/transfer_fee_plans')
    .query({ per_page: 20, page: 1 })
    .reply(200, {
      data: [mockFeePlan],
      meta: { ...listMeta, has_more: true },
    });

  nock(baseUrl)
    .get('/v1/transfer_fee_plans')
    .query({ per_page: 20, page: 2 })
    .reply(200, {
      data: [{ ...mockFeePlan, id: 'tfp_456' }],
      meta: { ...listMeta, page: 2, has_more: false },
    });

  const ids: string[] = [];
  for await (const plan of await transferFeePlans.iterateAllTransferFeePlans()) {
    ids.push(plan.id);
  }

  expect(ids).toEqual(['tfp_123', 'tfp_456']);
});
