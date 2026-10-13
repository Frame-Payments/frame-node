/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { WalletsAPI } from '../src/api/wallets-api';
import type { UpdateWalletParams, Wallet } from '../src/types/wallets';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const wallets = new WalletsAPI(client);

const mockWallet: Wallet = {
  id: 'wal_123',
  object: 'wallet',
  account_id: 'acct_123',
  default: true,
  name: 'Default',
  status: 'active',
  rejected_reason: null,
  available: { value: 0, currency: 'USD' },
  metadata: {},
  livemode: false,
  created: 1745107200,
  updated: 1745107200,
};

const listMeta = {
  page: 1,
  has_more: false,
  url: '/v2/wallets',
  next: null,
  prev: null,
};

afterEach(() => nock.cleanAll());

test('list wallets', async () => {
  const response = { data: [mockWallet], meta: listMeta };

  nock(baseUrl).get('/v2/wallets').query({ account_id: 'acct_123', per_page: 10, page: 1 }).reply(200, response);

  const result = await wallets.list({ account_id: 'acct_123', per_page: 10, page: 1 });
  expect(result).toEqual(response);
});

test('retrieve wallet', async () => {
  nock(baseUrl).get('/v2/wallets/wal_123').reply(200, mockWallet);

  const result = await wallets.retrieve('wal_123');
  expect(result).toEqual(mockWallet);
});

test('retrieve default wallet', async () => {
  nock(baseUrl).get('/v2/wallets/default').query({ account_id: 'acct_123' }).reply(200, mockWallet);

  const result = await wallets.retrieve_default({ account_id: 'acct_123' });
  expect(result).toEqual(mockWallet);
});

test('update wallet sends Idempotency-Key header (auto UUID when omitted)', async () => {
  const params: UpdateWalletParams = { name: 'Payouts' };
  let seenKey: string | undefined;

  nock(baseUrl, {
    reqheaders: {
      'Idempotency-Key': (value: string) => {
        seenKey = value;
        return typeof value === 'string' && value.length > 0;
      },
    },
  })
    .patch('/v2/wallets/wal_123', params)
    .reply(200, { ...mockWallet, name: 'Payouts' });

  const result = await wallets.update('wal_123', params);
  expect(result.name).toBe('Payouts');
  expect(seenKey).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('update wallet uses provided Idempotency-Key', async () => {
  const params: UpdateWalletParams = { default: true };

  nock(baseUrl, {
    reqheaders: { 'Idempotency-Key': 'my-key-123' },
  })
    .patch('/v2/wallets/wal_123', params)
    .reply(200, mockWallet);

  const result = await wallets.update('wal_123', params, { idempotencyKey: 'my-key-123' });
  expect(result).toEqual(mockWallet);
});
