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

test('getFingerprintConfiguration → GET /v1/config/fingerprint', async () => {
  nock(baseUrl)
    .get('/v1/config/fingerprint')
    .reply(200, { api_key: 'fp_xxx', region: 'us', environment: 'sealed' });

  const result = await configuration.getFingerprintConfiguration();
  expect(result).toEqual({ api_key: 'fp_xxx', region: 'us', environment: 'sealed' });
});

test('getLegalConfiguration → GET /v1/config/legal', async () => {
  const response = {
    privacy_url: 'https://example.com/privacy',
    terms_url: 'https://example.com/terms',
    platform_agreement_url: 'https://example.com/platform',
    cbc_terms_and_conditions: 'https://example.com/cbc',
  };

  nock(baseUrl).get('/v1/config/legal').reply(200, response);

  const result = await configuration.getLegalConfiguration();
  expect(result).toEqual(response);
});

test('getMapboxConfiguration → GET /v1/config/mapbox', async () => {
  const response = { access_token: 'pk.mapbox', expires_at: '2026-01-01T00:00:00Z' };

  nock(baseUrl).get('/v1/config/mapbox').reply(200, response);

  const result = await configuration.getMapboxConfiguration();
  expect(result).toEqual(response);
});

test('getAllConfiguration → GET /v1/config/all', async () => {
  const response = {
    evervault: { app_id: 'app_xxx', team_id: 'team_yyy' },
    fingerprint: { api_key: 'fp_xxx', region: 'us', environment: 'sealed' },
    sift: { account_id: 'sift_acc', beacon_key: 'beacon_xxx' },
    legal: {
      privacy_url: 'https://example.com/privacy',
      terms_url: 'https://example.com/terms',
      platform_agreement_url: 'https://example.com/platform',
      cbc_terms_and_conditions: 'https://example.com/cbc',
    },
    mapbox: { access_token: 'pk.mapbox', expires_at: '2026-01-01T00:00:00Z' },
  };

  nock(baseUrl).get('/v1/config/all').reply(200, response);

  const result = await configuration.getAllConfiguration();
  expect(result).toEqual(response);
});

test('honors usePublishableKey: true opt-in', async () => {
  nock(baseUrl, { reqheaders: { authorization: 'Bearer pk_test' } })
    .get('/v1/config/evervault')
    .reply(200, { app_id: 'a', team_id: 't' });

  await configuration.getEvervaultConfiguration({ usePublishableKey: true });
});
