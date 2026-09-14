/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { ChargeSessionsAPI } from '../src/api/charge_sessions-api';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const chargeSessions = new ChargeSessionsAPI(client);

afterEach(() => nock.cleanAll());

test('create → POST /v1/charge_sessions sends fingerprint_visitor_id/account_id, omits absent sealed_result', async () => {
  const input = {
    charge_intent_id: 'ci_123',
    fingerprint_visitor_id: 'visitor_abc',
    account_id: 'acct_123',
  };

  nock(baseUrl).post('/v1/charge_sessions', input).reply(200, {
    sonar_session_id: 'cs_123',
    object: 'charge_session',
    status: 'active',
    created: 1,
    updated: 1,
    livemode: false,
  });

  const result = await chargeSessions.create(input);
  expect(result.sonar_session_id).toEqual('cs_123');
});

test('create → sends sealed_result when provided', async () => {
  const input = {
    fingerprint_visitor_id: 'visitor_abc',
    account_id: 'acct_123',
    sealed_result: 'base64sealed',
  };

  nock(baseUrl).post('/v1/charge_sessions', input).reply(200, {
    sonar_session_id: 'cs_123',
    object: 'charge_session',
    status: 'active',
    created: 1,
    updated: 1,
    livemode: false,
  });

  const result = await chargeSessions.create(input);
  expect(result.sonar_session_id).toEqual('cs_123');
});

test('update → PATCH /v1/charge_sessions/{id}', async () => {
  const input = { status: 'completed', account_id: 'acct_123' };

  nock(baseUrl).patch('/v1/charge_sessions/cs_123', input).reply(200, {
    sonar_session_id: 'cs_123',
    object: 'charge_session',
    status: 'completed',
    created: 1,
    updated: 2,
    livemode: false,
  });

  const result = await chargeSessions.update('cs_123', input);
  expect(result.status).toEqual('completed');
});
