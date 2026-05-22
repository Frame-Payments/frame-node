/// <reference types="jest" />

import axios from 'axios';
import nock from 'nock';
import { PhoneVerificationsAPI } from '../src/api/phone_verifications-api';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const phones = new PhoneVerificationsAPI(client);

afterEach(() => nock.cleanAll());

const mockVerification = {
  id: 'pv_1',
  object: 'phone_verification',
  status: 'pending',
  phone_number: '+15551234567',
  account_id: 'acct_eric',
  created: 1,
  updated: 1,
  livemode: false,
};

test('create → POST /v1/accounts/{id}/phone_verifications', async () => {
  nock(baseUrl)
    .post('/v1/accounts/acct_eric/phone_verifications', { phone_number: '+15551234567' })
    .reply(200, mockVerification);

  const result = await phones.create('acct_eric', { phone_number: '+15551234567' });
  expect(result.id).toBe('pv_1');
});

test('create response surfaces prove_auth_token when present', async () => {
  nock(baseUrl)
    .post('/v1/accounts/acct_eric/phone_verifications')
    .reply(200, { ...mockVerification, prove_auth_token: 'prove_tok_abc' });

  const result = await phones.create('acct_eric', { phone_number: '+15551234567' });
  expect(result.prove_auth_token).toBe('prove_tok_abc');
});

test('create honors usePublishableKey', async () => {
  nock(baseUrl)
    .post('/v1/accounts/acct_eric/phone_verifications')
    .matchHeader('X-Frame-Use-Publishable-Key', '1')
    .reply(200, mockVerification);

  await phones.create('acct_eric', { phone_number: '+15551234567' }, { usePublishableKey: true });
});

test('confirm → POST /v1/accounts/{id}/phone_verifications/{id}/confirm', async () => {
  nock(baseUrl)
    .post('/v1/accounts/acct_eric/phone_verifications/pv_1/confirm', { code: '654321' })
    .reply(200, { ...mockVerification, status: 'verified' });

  const result = await phones.confirm('acct_eric', 'pv_1', { code: '654321' });
  expect(result.status).toBe('verified');
});
