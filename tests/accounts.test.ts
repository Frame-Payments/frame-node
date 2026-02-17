/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { AccountsAPI } from '../src/api/accounts-api';
import type { Account } from '../src/types/accounts';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const accounts = new AccountsAPI(client);

const mockAccount: Account = {
  id: 'acct_123',
  object: 'account',
  type: 'individual',
  status: 'active',
  external_id: 'ext_123',
  metadata: {},
  profile: null,
  capabilities: [],
  created: 1234567890,
  updated: 1234567890,
  livemode: false,
};

const listResponse = {
  meta: {
    page: 1,
    url: '/v1/accounts',
    has_more: false,
    prev: null,
    next: null,
  },
  data: [mockAccount],
};

test('list accounts', async () => {
  nock(baseUrl).get('/v1/accounts').query({ per_page: 10, page: 1 }).reply(200, listResponse);

  const result = await accounts.list({ per_page: 10, page: 1 });
  expect(result).toEqual(listResponse);
});

test('create account', async () => {
  const input = {
    type: 'individual',
    profile: {
      individual: {
        name: { first_name: 'Jane', last_name: 'Doe' },
        email: 'jane@example.com',
      },
    },
  };

  nock(baseUrl).post('/v1/accounts', input).reply(201, mockAccount);

  const result = await accounts.create(input as any);
  expect(result).toEqual(mockAccount);
});

test('get account', async () => {
  nock(baseUrl).get('/v1/accounts/acct_123').reply(200, mockAccount);

  const result = await accounts.get('acct_123');
  expect(result).toEqual(mockAccount);
});

test('update account', async () => {
  const updates = { metadata: { key: 'value' } };
  const updated = { ...mockAccount, ...updates };

  nock(baseUrl).patch('/v1/accounts/acct_123', updates).reply(200, updated);

  const result = await accounts.update('acct_123', updates as any);
  expect(result).toEqual(updated);
});

test('disable account', async () => {
  nock(baseUrl).delete('/v1/accounts/acct_123').reply(200, mockAccount);

  const result = await accounts.disable('acct_123');
  expect(result).toEqual(mockAccount);
});
