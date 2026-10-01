/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { TransfersV2API } from '../src/api/transfers-v2-api';
import type { TransferV2, CreateTransferV2Params } from '../src/types/transfers-v2';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const transfersV2 = new TransfersV2API(client);

const mockTransfer: TransferV2 = {
  id: 'tr_v2_123',
  object: 'transfer',
  type: 'payment',
  status: 'pending',
  amount: { value: 1000, currency: 'usd' },
  fee: { value: 30, currency: 'usd' },
  net_amount: { value: 970, currency: 'usd' },
  description: 'Test V2 transfer',
  reference: 'ref_abc',
  metadata: {},
  source: {
    payment_method: {
      id: 'pm_src_123',
      object: 'payment_method',
      type: 'card',
      livemode: true,
      created: 1713435744,
      updated: 1713435744,
    },
  },
  destination: null,
  payment: {
    status: 'pending',
    authorization_mode: 'automatic',
  },
  client_secret: 'tr_v2_123_secret_abc',
  created: 1713435744,
  livemode: true,
};

const listMeta = {
  page: 1,
  has_more: false,
  url: '/v2/transfers',
  next: null,
  prev: null,
};

afterEach(() => nock.cleanAll());

test('create transfer v2 sends Idempotency-Key header (auto UUID when omitted)', async () => {
  const input: CreateTransferV2Params = {
    amount: { value: 1000, currency: 'usd' },
    source: { payment_method_id: 'pm_src_123' },
    confirm: true,
  };

  let seenKey: string | undefined;
  nock(baseUrl, {
    reqheaders: {
      'Idempotency-Key': (value: string) => {
        seenKey = value;
        return typeof value === 'string' && value.length > 0;
      },
    },
  })
    .post('/v2/transfers', input as any)
    .reply(200, mockTransfer);

  const result = await transfersV2.create(input);
  expect(result).toEqual(mockTransfer);
  expect(seenKey).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('create transfer v2 uses provided Idempotency-Key', async () => {
  const input: CreateTransferV2Params = {
    amount: { value: 1000, currency: 'usd' },
    source: { payment_method_id: 'pm_src_123' },
  };

  nock(baseUrl, {
    reqheaders: { 'Idempotency-Key': 'my-key-123' },
  })
    .post('/v2/transfers', input as any)
    .reply(200, mockTransfer);

  const result = await transfersV2.create(input, { idempotencyKey: 'my-key-123' });
  expect(result).toEqual(mockTransfer);
});

test('retrieve transfer v2', async () => {
  nock(baseUrl).get('/v2/transfers/tr_v2_123').reply(200, mockTransfer);

  const result = await transfersV2.retrieve('tr_v2_123');
  expect(result).toEqual(mockTransfer);
});

test('list transfers v2', async () => {
  const response = { data: [mockTransfer], meta: listMeta };

  nock(baseUrl).get('/v2/transfers').query({ per_page: 10, page: 1 }).reply(200, response);

  const result = await transfersV2.list(10, 1);
  expect(result).toEqual(response);
});

test('update transfer v2', async () => {
  const params = { description: 'updated' };
  const updated = { ...mockTransfer, description: 'updated' };

  nock(baseUrl).patch('/v2/transfers/tr_v2_123', params).reply(200, updated);

  const result = await transfersV2.update('tr_v2_123', params);
  expect(result).toEqual(updated);
});

test('confirm transfer v2 sends Idempotency-Key for secret-key confirm', async () => {
  const confirmed = { ...mockTransfer, status: 'completed' };

  nock(baseUrl)
    .post('/v2/transfers/tr_v2_123/confirm')
    .matchHeader('Idempotency-Key', (value: string) => typeof value === 'string' && value.length > 0)
    .reply(200, confirmed);

  const result = await transfersV2.confirm('tr_v2_123');
  expect(result).toEqual(confirmed);
});

test('confirm transfer v2 with client_secret omits Idempotency-Key', async () => {
  const confirmed = { ...mockTransfer, status: 'completed' };

  nock(baseUrl)
    .post('/v2/transfers/tr_v2_123/confirm', { client_secret: 'tr_v2_123_secret_abc' })
    .reply(200, confirmed);

  const result = await transfersV2.confirm('tr_v2_123', {
    client_secret: 'tr_v2_123_secret_abc',
  });
  expect(result).toEqual(confirmed);
});

test('capture transfer v2', async () => {
  const captured = { ...mockTransfer, status: 'completed' };
  const params = { amount: { value: 500, currency: 'usd' } };

  nock(baseUrl)
    .post('/v2/transfers/tr_v2_123/capture', params)
    .matchHeader('Idempotency-Key', (value: string) => typeof value === 'string' && value.length > 0)
    .reply(200, captured);

  const result = await transfersV2.capture('tr_v2_123', params);
  expect(result).toEqual(captured);
});

test('void transfer v2', async () => {
  const voided = { ...mockTransfer, status: 'canceled' };

  nock(baseUrl)
    .post('/v2/transfers/tr_v2_123/void')
    .matchHeader('Idempotency-Key', (value: string) => typeof value === 'string' && value.length > 0)
    .reply(200, voided);

  const result = await transfersV2.void('tr_v2_123');
  expect(result).toEqual(voided);
});

test('refund transfer v2', async () => {
  const refunded = { ...mockTransfer, status: 'reversed' };
  const params = { amount: { value: 250, currency: 'usd' } };

  nock(baseUrl)
    .post('/v2/transfers/tr_v2_123/refund', params)
    .matchHeader('Idempotency-Key', (value: string) => typeof value === 'string' && value.length > 0)
    .reply(200, refunded);

  const result = await transfersV2.refund('tr_v2_123', params);
  expect(result).toEqual(refunded);
});

test('iterate all transfers v2 across pages', async () => {
  nock(baseUrl)
    .get('/v2/transfers')
    .query({ per_page: 20, page: 1 })
    .reply(200, {
      data: [mockTransfer],
      meta: { ...listMeta, has_more: true },
    });

  nock(baseUrl)
    .get('/v2/transfers')
    .query({ per_page: 20, page: 2 })
    .reply(200, {
      data: [{ ...mockTransfer, id: 'tr_v2_456' }],
      meta: { ...listMeta, page: 2, has_more: false },
    });

  const ids: string[] = [];
  for await (const transfer of await transfersV2.iterateAllTransfers()) {
    ids.push(transfer.id);
  }

  expect(ids).toEqual(['tr_v2_123', 'tr_v2_456']);
});
