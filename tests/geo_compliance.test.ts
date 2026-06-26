/// <reference types="jest" />

import nock from 'nock';
import { createApiClient } from '../src/client';
import { GeoComplianceAPI } from '../src/api/geo_compliance-api';

const baseUrl = 'https://api.framepayments.com';
const client = createApiClient({ apiKey: 'sk_test', publishableKey: 'pk_test' });
const geo = new GeoComplianceAPI(client);

afterEach(() => nock.cleanAll());

test('getAccountStatus → GET /v1/accounts/{id}/geo_compliance', async () => {
  const body = {
    status: 'clear',
    sonar_session_id: 'sonar_1',
    evaluated_at: 1234,
  };

  nock(baseUrl, { reqheaders: { authorization: 'Bearer sk_test' } })
    .get('/v1/accounts/acct_eric/geo_compliance')
    .reply(200, body);

  const result = await geo.getAccountStatus('acct_eric');
  expect(result).toEqual(body);
});

test('honors usePublishableKey opt-in', async () => {
  nock(baseUrl, { reqheaders: { authorization: 'Bearer pk_test' } })
    .get('/v1/accounts/acct_eric/geo_compliance')
    .reply(200, { status: 'clear', evaluated_at: 1 });

  await geo.getAccountStatus('acct_eric', { usePublishableKey: true });
});
