/// <reference types="jest" />

import nock from 'nock';
import { createApiClient } from '../src/client';
import { ConfigurationAPI } from '../src/api/configuration-api';

const baseUrl = 'https://api.framepayments.com';
const client = createApiClient({ apiKey: 'sk_test', publishableKey: 'pk_test' });
const configuration = new ConfigurationAPI(client);

afterEach(() => nock.cleanAll());

test('getEvervaultConfiguration → GET /v1/config/evervault (secret key by default)', async () => {
  nock(baseUrl, { reqheaders: { authorization: 'Bearer sk_test' } })
    .get('/v1/config/evervault')
    .reply(200, { app_id: 'app_xxx', team_id: 'team_yyy' });

  const result = await configuration.getEvervaultConfiguration();
  expect(result).toEqual({ app_id: 'app_xxx', team_id: 'team_yyy' });
});

test('getSiftConfiguration → GET /v1/config/sift (secret key by default)', async () => {
  nock(baseUrl, { reqheaders: { authorization: 'Bearer sk_test' } })
    .get('/v1/config/sift')
    .reply(200, { account_id: 'sift_acc', beacon_key: 'beacon_xxx' });

  const result = await configuration.getSiftConfiguration();
  expect(result).toEqual({ account_id: 'sift_acc', beacon_key: 'beacon_xxx' });
});

test('honors usePublishableKey: true opt-in', async () => {
  nock(baseUrl, { reqheaders: { authorization: 'Bearer pk_test' } })
    .get('/v1/config/evervault')
    .reply(200, { app_id: 'a', team_id: 't' });

  await configuration.getEvervaultConfiguration({ usePublishableKey: true });
});
