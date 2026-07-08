import nock from 'nock';
import axios from 'axios';
import { ThreeDsIntentsAPI, ThreeDSAPI } from '../src/api/three_ds-api';
import type { ThreeDSIntent } from '../src/types/three_ds';

const baseURL = 'https://api.framepayments.com';
const client = axios.create({ baseURL });
const threeDsIntents = new ThreeDsIntentsAPI(client);

const mockIntent = { id: '3ds_123', object: 'three_ds_intent', status: 'pending' } as unknown as ThreeDSIntent;

afterEach(() => nock.cleanAll());

test('create → POST /v1/3ds/intents', async () => {
  nock(baseURL).post('/v1/3ds/intents').reply(201, mockIntent);
  const result = await threeDsIntents.create({} as never);
  expect(result).toEqual(mockIntent);
});

test('retrieve → GET /v1/3ds/intents/{id}', async () => {
  nock(baseURL).get('/v1/3ds/intents/3ds_123').reply(200, mockIntent);
  const result = await threeDsIntents.retrieve('3ds_123');
  expect(result).toEqual(mockIntent);
});

test('get (deprecated) delegates to retrieve', async () => {
  nock(baseURL).get('/v1/3ds/intents/3ds_123').reply(200, mockIntent);
  const result = await threeDsIntents.get('3ds_123');
  expect(result).toEqual(mockIntent);
});

test('resend → POST /v1/3ds/intents/{id}/resend', async () => {
  nock(baseURL).post('/v1/3ds/intents/3ds_123/resend').reply(200, mockIntent);
  const result = await threeDsIntents.resend('3ds_123');
  expect(result).toEqual(mockIntent);
});

test('ThreeDSAPI is a deprecated alias of ThreeDsIntentsAPI', () => {
  expect(ThreeDSAPI).toBe(ThreeDsIntentsAPI);
});
