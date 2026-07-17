/// <reference types="jest" />

import nock from 'nock';
import { createApiClient } from '../src/client';
import { BeneficialOwnersAPI } from '../src/api/beneficial_owners-api';

const baseUrl = 'https://api.framepayments.com';
const client = createApiClient({ apiKey: 'sk_test', publishableKey: 'pk_test' });
const beneficialOwners = new BeneficialOwnersAPI(client);

afterEach(() => nock.cleanAll());

const mockOwner = {
  id: 'bo_1',
  object: 'beneficial_owner',
  account_id: 'acct_eric',
  first_name: 'Janet',
  middle_name: null,
  last_name: 'Jones',
  suffix: null,
  email: 'janet@example.com',
  roles: ['owner', 'controller'],
  percent_ownership: 50,
  status: 'completed',
  livemode: false,
  created: 1,
  updated: 1,
};

test('list → GET /v1/accounts/{id}/beneficial_owners', async () => {
  nock(baseUrl)
    .get('/v1/accounts/acct_eric/beneficial_owners')
    .reply(200, { data: [mockOwner] });

  const result = await beneficialOwners.list('acct_eric');
  expect(result.data[0].id).toBe('bo_1');
});

test('create → POST /v1/accounts/{id}/beneficial_owners', async () => {
  const params = {
    first_name: 'Janet',
    last_name: 'Jones',
    email: 'janet@example.com',
    roles: ['owner', 'controller'],
  };
  nock(baseUrl)
    .post('/v1/accounts/acct_eric/beneficial_owners', params)
    .reply(201, mockOwner);

  const result = await beneficialOwners.create('acct_eric', params);
  expect(result.id).toBe('bo_1');
});

test('create honors usePublishableKey', async () => {
  nock(baseUrl, { reqheaders: { authorization: 'Bearer pk_test' } })
    .post('/v1/accounts/acct_eric/beneficial_owners')
    .reply(201, mockOwner);

  await beneficialOwners.create(
    'acct_eric',
    { first_name: 'Janet', last_name: 'Jones', email: 'janet@example.com', roles: ['owner'] },
    { usePublishableKey: true },
  );
});

test('retrieve → GET /v1/accounts/{id}/beneficial_owners/{id}', async () => {
  nock(baseUrl)
    .get('/v1/accounts/acct_eric/beneficial_owners/bo_1')
    .reply(200, mockOwner);

  const result = await beneficialOwners.retrieve('acct_eric', 'bo_1');
  expect(result.id).toBe('bo_1');
});

test('update → PATCH /v1/accounts/{id}/beneficial_owners/{id}', async () => {
  const updates = { percent_ownership: 40, roles: ['owner'] };
  nock(baseUrl)
    .patch('/v1/accounts/acct_eric/beneficial_owners/bo_1', updates)
    .reply(200, { ...mockOwner, ...updates });

  const result = await beneficialOwners.update('acct_eric', 'bo_1', updates);
  expect(result.percent_ownership).toBe(40);
});

test('delete → DELETE /v1/accounts/{id}/beneficial_owners/{id} (204)', async () => {
  nock(baseUrl)
    .delete('/v1/accounts/acct_eric/beneficial_owners/bo_1')
    .reply(204);

  await expect(beneficialOwners.delete('acct_eric', 'bo_1')).resolves.toBeUndefined();
});

test('confirmRoster → POST /v1/accounts/{id}/beneficial_owners/confirm returns account', async () => {
  const account = { id: 'acct_eric', object: 'account', status: 'active' };
  nock(baseUrl)
    .post('/v1/accounts/acct_eric/beneficial_owners/confirm')
    .reply(200, account);

  const result = await beneficialOwners.confirmRoster('acct_eric');
  expect(result.object).toBe('account');
});

test('resendInvite → POST /v1/accounts/{id}/beneficial_owners/{id}/resend_invite', async () => {
  nock(baseUrl)
    .post('/v1/accounts/acct_eric/beneficial_owners/bo_1/resend_invite')
    .reply(200, { ...mockOwner, status: 'invite_sent' });

  const result = await beneficialOwners.resendInvite('acct_eric', 'bo_1');
  expect(result.status).toBe('invite_sent');
});
