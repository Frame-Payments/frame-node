/// <reference types="jest" />

import axios from 'axios';
import nock from 'nock';
import { GeoComplianceAPI } from '../src/api/geo_compliance-api';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const geo = new GeoComplianceAPI(client);

afterEach(() => nock.cleanAll());

test('getAccountStatus → GET /v1/accounts/{id}/geo_compliance', async () => {
  const body = {
    status: 'clear',
    sonar_session_id: 'sonar_1',
    evaluated_at: 1234,
  };

  nock(baseUrl)
    .get('/v1/accounts/acct_eric/geo_compliance')
    .matchHeader('X-Frame-Use-Publishable-Key', (val) => val === undefined)
    .reply(200, body);

  const result = await geo.getAccountStatus('acct_eric');
  expect(result).toEqual(body);
});

test('honors usePublishableKey opt-in', async () => {
  nock(baseUrl)
    .get('/v1/accounts/acct_eric/geo_compliance')
    .matchHeader('X-Frame-Use-Publishable-Key', '1')
    .reply(200, { status: 'clear', evaluated_at: 1 });

  await geo.getAccountStatus('acct_eric', { usePublishableKey: true });
});
