/// <reference types="jest" />

import nock from 'nock';
import { createApiClient } from '../src/client';
import { WalletAPI } from '../src/api/wallet-api';

const baseUrl = 'https://api.framepayments.com';
const client = createApiClient({ apiKey: 'sk_test', publishableKey: 'pk_test' });
const wallet = new WalletAPI(client);

afterEach(() => nock.cleanAll());

test('getGooglePayConfiguration → GET /v1/client/wallet/google_pay', async () => {
  const config = {
    identifier: 'frame.merchant.id',
    environment: 'TEST',
    processor: 'stripe',
    processor_key: 'pk_live_xyz',
  };

  // Publishable-by-default endpoint — routes via the publishable key.
  nock(baseUrl, { reqheaders: { authorization: 'Bearer pk_test' } })
    .get('/v1/client/wallet/google_pay')
    .reply(200, config);

  const result = await wallet.getGooglePayConfiguration();
  expect(result).toEqual(config);
});
