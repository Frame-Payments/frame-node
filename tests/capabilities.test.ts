/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { CapabilitiesAPI } from '../src/api/capabilities-api';
import type { Capability } from '../src/types/capabilities';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const capabilities = new CapabilitiesAPI(client);

const mockCapability: Capability = {
  id: 'cap_123',
  object: 'capability',
  name: 'card_send',
  status: 'active',
  disabled_reason: null,
  requirements: [],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

test('list capabilities', async () => {
  nock(baseUrl).get('/v1/accounts/acct_123/capabilities').reply(200, [mockCapability]);

  const result = await capabilities.list('acct_123');
  expect(result).toEqual([mockCapability]);
});

test('request capabilities', async () => {
  const input = { capabilities: ['card_send', 'ach_send'] };

  nock(baseUrl).post('/v1/accounts/acct_123/capabilities', input).reply(201, [mockCapability]);

  const result = await capabilities.request('acct_123', input);
  expect(result).toEqual([mockCapability]);
});

test('get capability', async () => {
  nock(baseUrl).get('/v1/accounts/acct_123/capabilities/card_send').reply(200, mockCapability);

  const result = await capabilities.get('acct_123', 'card_send');
  expect(result).toEqual(mockCapability);
});

test('disable capability', async () => {
  nock(baseUrl).delete('/v1/accounts/acct_123/capabilities/card_send').reply(200, mockCapability);

  const result = await capabilities.disable('acct_123', 'card_send');
  expect(result).toEqual(mockCapability);
});
