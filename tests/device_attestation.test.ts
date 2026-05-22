/// <reference types="jest" />

import axios from 'axios';
import nock from 'nock';
import { DeviceAttestationAPI } from '../src/api/device_attestation-api';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const attestation = new DeviceAttestationAPI(client);

afterEach(() => nock.cleanAll());

test('getChallenge → POST /v1/client/device_attestation/challenge', async () => {
  nock(baseUrl)
    .post('/v1/client/device_attestation/challenge')
    .matchHeader('X-Frame-Use-Publishable-Key', '1')
    .reply(200, { challenge: 'nonce_xyz' });

  const result = await attestation.getChallenge();
  expect(result).toEqual({ challenge: 'nonce_xyz' });
});

test('attest → POST /v1/client/device_attestation/attest with body', async () => {
  const body = {
    key_id: 'key_abc',
    attestation_object: 'base64stuff==',
    challenge: 'nonce_xyz',
  };

  nock(baseUrl)
    .post('/v1/client/device_attestation/attest', body)
    .matchHeader('X-Frame-Use-Publishable-Key', '1')
    .reply(200, { status: 'attested', key_id: 'key_abc' });

  const result = await attestation.attest(body);
  expect(result).toEqual({ status: 'attested', key_id: 'key_abc' });
});
