import nock from 'nock';
import axios from 'axios';
import { WebhookEndpointsAPI } from '../src/api/webhook_endpoints-api';
import type {
  WebhookEndpoint,
  CreateWebhookEndpointParams,
  UpdateWebhookEndpointParams,
} from '../src/types/webhook_endpoints';

const baseURL = 'https://api.framepayments.com';
const client = axios.create({ baseURL });
const webhookEndpoints = new WebhookEndpointsAPI(client);

const mockEndpoint: WebhookEndpoint = {
  id: 'we_123',
  object: 'webhook_endpoint',
  url: 'https://example.com/hook',
  status: 'active',
  description: 'Test',
  event_codes: ['charge.captured'],
  livemode: false,
  created: 1745107200,
  updated: 1745107200,
};

afterEach(() => nock.cleanAll());

test('list webhook endpoints', async () => {
  const response = {
    meta: { page: 1, has_more: false, url: '/v1/webhook_endpoints', prev: null, next: null },
    data: [mockEndpoint],
  };
  nock(baseURL).get('/v1/webhook_endpoints').query(true).reply(200, response);

  const result = await webhookEndpoints.list(10, 1);
  expect(result).toEqual(response);
});

test('create webhook endpoint returns the signing secret', async () => {
  const params: CreateWebhookEndpointParams = {
    url: 'https://example.com/hook',
    event_codes: ['charge.captured'],
    description: 'Test',
  };
  const created = { ...mockEndpoint, secret: 'whsec_abc123' };
  nock(baseURL).post('/v1/webhook_endpoints', params as any).reply(201, created);

  const result = await webhookEndpoints.create(params);
  expect(result).toEqual(created);
  expect(result.secret).toBe('whsec_abc123');
});

test('retrieve webhook endpoint (no secret)', async () => {
  nock(baseURL).get('/v1/webhook_endpoints/we_123').reply(200, mockEndpoint);

  const result = await webhookEndpoints.retrieve('we_123');
  expect(result).toEqual(mockEndpoint);
  expect(result.secret).toBeUndefined();
});

test('update webhook endpoint', async () => {
  const updates: UpdateWebhookEndpointParams = {
    url: 'https://example.com/new',
    event_codes: ['charge_intent.expired'],
  };
  const updated = { ...mockEndpoint, ...updates };
  nock(baseURL).patch('/v1/webhook_endpoints/we_123', updates as any).reply(200, updated);

  const result = await webhookEndpoints.update('we_123', updates);
  expect(result).toEqual(updated);
});

test('delete webhook endpoint returns a deletion stub', async () => {
  const deleted = { id: 'we_123', object: 'webhook_endpoint', deleted: true };
  nock(baseURL).delete('/v1/webhook_endpoints/we_123').reply(200, deleted);

  const result = await webhookEndpoints.delete('we_123');
  expect(result).toEqual(deleted);
});

test('rotateSecret returns the endpoint with a new secret', async () => {
  const rotated = { ...mockEndpoint, secret: 'whsec_rotated456' };
  nock(baseURL).post('/v1/webhook_endpoints/we_123/rotate_secret').reply(200, rotated);

  const result = await webhookEndpoints.rotateSecret('we_123');
  expect(result).toEqual(rotated);
  expect(result.secret).toBe('whsec_rotated456');
});
