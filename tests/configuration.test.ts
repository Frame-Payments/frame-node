/// <reference types="jest" />

import axios from 'axios';
import nock from 'nock';
import { ConfigurationAPI } from '../src/api/configuration-api';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const configuration = new ConfigurationAPI(client);

afterEach(() => nock.cleanAll());

test('getEvervaultConfiguration → GET /v1/config/evervault (secret key by default)', async () => {
  nock(baseUrl)
    .get('/v1/config/evervault')
    .matchHeader('X-Frame-Use-Publishable-Key', (val) => val === undefined)
    .reply(200, { app_id: 'app_xxx', team_id: 'team_yyy' });

  const result = await configuration.getEvervaultConfiguration();
  expect(result).toEqual({ app_id: 'app_xxx', team_id: 'team_yyy' });
});

test('getSiftConfiguration → GET /v1/config/sift (secret key by default)', async () => {
  nock(baseUrl)
    .get('/v1/config/sift')
    .matchHeader('X-Frame-Use-Publishable-Key', (val) => val === undefined)
    .reply(200, { account_id: 'sift_acc', beacon_key: 'beacon_xxx' });

  const result = await configuration.getSiftConfiguration();
  expect(result).toEqual({ account_id: 'sift_acc', beacon_key: 'beacon_xxx' });
});

test('honors usePublishableKey: true opt-in', async () => {
  nock(baseUrl)
    .get('/v1/config/evervault')
    .matchHeader('X-Frame-Use-Publishable-Key', '1')
    .reply(200, { app_id: 'a', team_id: 't' });

  await configuration.getEvervaultConfiguration({ usePublishableKey: true });
});
