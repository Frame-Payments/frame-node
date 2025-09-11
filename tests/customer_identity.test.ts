/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { CustomerIdentityVerificationsAPI } from '../src/api/customer_identity-api';
import { VerificationStatus, type CustomerIdentityVerification } from '../src/types/customer_identity';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const identityAPI = new CustomerIdentityVerificationsAPI(client);

const mockVerification: CustomerIdentityVerification = {
    id: 'civ_123',
    status: VerificationStatus.PENDING,
    created: 1625256000,
    updated: 1625257000,
    object: 'customer_identity_verification',
    verification_url: null,
    pending: null,
    verified: null,
    failed: null
};

test('create identity verification', async () => {
  const params = { customer: 'cus_456' };

  nock(baseUrl)
    .post('/v1/customer_identity_verifications', params)
    .reply(200, mockVerification);

  const result = await identityAPI.create(params as any);
  expect(result).toEqual(mockVerification);
});

test('get identity verification by id', async () => {
  nock(baseUrl)
    .get('/v1/customer_identity_verifications/civ_123')
    .reply(200, mockVerification);

  const result = await identityAPI.get('civ_123');
  expect(result).toEqual(mockVerification);
});