/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { IdvAPI } from '../src/api/idv-api';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const idv = new IdvAPI(client);

afterEach(() => nock.cleanAll());

test('createSession → POST /v1/idv/session', async () => {
  nock(baseUrl).post('/v1/idv/session').reply(200, { inquiry_id: 'inq_123' });

  const result = await idv.createSession();
  expect(result).toEqual({ inquiry_id: 'inq_123' });
});

test('completeSession → POST /v1/idv/complete', async () => {
  const response = {
    verified: true,
    status: 'completed',
    category: 'success',
    failure_type: undefined,
    retriable: false,
  };

  nock(baseUrl).post('/v1/idv/complete', { inquiry_id: 'inq_123' }).reply(200, response);

  const result = await idv.completeSession('inq_123');
  expect(result).toEqual(response);
});
