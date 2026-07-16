/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { TransfersAPI } from '../src/api/transfers-api';
import type { Transfer, CreateTransferParams } from '../src/types/transfers';
import type { PaymentMethod } from '../src/types/payment_methods';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const transfers = new TransfersAPI(client);

const mockSourcePaymentMethod: PaymentMethod = {
  id: 'pm_src_123',
  object: 'payment_method',
  type: 'card',
  livemode: true,
  created: 1713435744,
  updated: 1713435744,
};

const mockDestinationPaymentMethod: PaymentMethod = {
  id: 'pm_dst_456',
  object: 'payment_method',
  type: 'ach',
  livemode: true,
  created: 1713435744,
  updated: 1713435744,
};

const mockTransfer: Transfer = {
  id: 'tr_123',
  object: 'transfer',
  amount: 1000,
  currency: 'usd',
  status: 'pending',
  account_id: 'acct_123',
  source_payment_method: mockSourcePaymentMethod,
  destination_payment_method: mockDestinationPaymentMethod,
  description: 'Test transfer',
  seller_id: 'seller_123',
  reference: 'ref_abc',
  metadata: {},
  created: 1713435744,
  updated: 1713435744,
  livemode: true,
};

const listMeta = {
  page: 1,
  has_more: false,
  url: '/v1/transfers',
  next: null,
  prev: null,
};

afterEach(() => nock.cleanAll());

test('create transfer - payment to account (source required, destination routes to account)', async () => {
  const input: CreateTransferParams = {
    amount: 1000,
    account_id: 'acct_123',
    currency: 'usd',
    source_payment_method_id: 'pm_src_123',
    destination_payment_method_id: 'pm_dst_456',
    seller_id: 'seller_123',
    confirm: true,
    sonar_session_id: 'sonar_sess_abc',
    reference: 'ref_abc',
  };

  nock(baseUrl).post('/v1/transfers', input as any).reply(200, mockTransfer);

  const result = await transfers.create(input);
  expect(result).toEqual(mockTransfer);
});

test('create transfer - payment to platform (source required, destination omitted)', async () => {
  const input: CreateTransferParams = {
    amount: 1000,
    account_id: 'acct_123',
    source_payment_method_id: 'pm_src_123',
  };

  const expected: Transfer = {
    ...mockTransfer,
    destination_payment_method: null,
  };

  nock(baseUrl).post('/v1/transfers', input as any).reply(200, expected);

  const result = await transfers.create(input);
  expect(result).toEqual(expected);
});

test('create transfer - payout (destination required, source omitted)', async () => {
  const input: CreateTransferParams = {
    amount: 1000,
    account_id: 'acct_123',
    destination_payment_method_id: 'pm_dst_456',
  };

  const expected: Transfer = {
    ...mockTransfer,
    source_payment_method: null,
  };

  nock(baseUrl).post('/v1/transfers', input as any).reply(200, expected);

  const result = await transfers.create(input);
  expect(result).toEqual(expected);
});

test('get transfer', async () => {
  nock(baseUrl).get('/v1/transfers/tr_123').reply(200, mockTransfer);

  const result = await transfers.get('tr_123');
  expect(result).toEqual(mockTransfer);
});

test('retrieve transfer', async () => {
  nock(baseUrl).get('/v1/transfers/tr_123').reply(200, mockTransfer);

  const result = await transfers.retrieve('tr_123');
  expect(result).toEqual(mockTransfer);
});

test('list transfers', async () => {
  const response = { data: [mockTransfer], meta: listMeta };

  nock(baseUrl).get('/v1/transfers').query({ per_page: 10, page: 1 }).reply(200, response);

  const result = await transfers.list(10, 1);
  expect(result).toEqual(response);
});

test('iterate all transfers across pages', async () => {
  nock(baseUrl)
    .get('/v1/transfers')
    .query({ per_page: 20, page: 1 })
    .reply(200, {
      data: [mockTransfer],
      meta: { ...listMeta, has_more: true },
    });

  nock(baseUrl)
    .get('/v1/transfers')
    .query({ per_page: 20, page: 2 })
    .reply(200, {
      data: [{ ...mockTransfer, id: 'tr_456' }],
      meta: { ...listMeta, page: 2, has_more: false },
    });

  const ids: string[] = [];
  for await (const transfer of await transfers.iterateAllTransfers()) {
    ids.push(transfer.id);
  }

  expect(ids).toEqual(['tr_123', 'tr_456']);
});
