/// <reference types="jest" />

import axios from 'axios';
import nock from 'nock';
import { WalletAPI } from '../src/api/wallet-api';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const wallet = new WalletAPI(client);

afterEach(() => nock.cleanAll());

test('getGooglePayConfiguration → GET /v1/client/wallet/google_pay', async () => {
  const config = {
    identifier: 'frame.merchant.id',
    environment: 'TEST',
    processor: 'stripe',
    processor_key: 'pk_live_xyz',
  };

  nock(baseUrl)
    .get('/v1/client/wallet/google_pay')
    .matchHeader('X-Frame-Use-Publishable-Key', '1')
    .reply(200, config);

  const result = await wallet.getGooglePayConfiguration();
  expect(result).toEqual(config);
});
