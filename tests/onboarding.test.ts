/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { OnboardingAPI } from '../src/api/onboarding-api';
import type { OnboardingSession } from '../src/types/onboarding';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const onboarding = new OnboardingAPI(client);

const mockSession: OnboardingSession = {
  id: 'onb_123',
  object: 'onboarding_session',
  status: 'in_progress',
  customer_id: 'cus_123',
  livemode: false,
  created_at: 1234567890,
};

const listResponse = {
  object: 'list',
  data: [mockSession],
  has_more: false,
  url: '/v1/onboarding/sessions',
};

test('list onboarding sessions', async () => {
  nock(baseUrl).get('/v1/onboarding/sessions').reply(200, listResponse);

  const result = await onboarding.list();
  expect(result).toEqual(listResponse);
});

test('list onboarding sessions with params', async () => {
  nock(baseUrl).get('/v1/onboarding/sessions').query({ customer_id: 'cus_123' }).reply(200, listResponse);

  const result = await onboarding.list({ customer_id: 'cus_123' });
  expect(result).toEqual(listResponse);
});

test('create onboarding session', async () => {
  const params = { customer_id: 'cus_123', entry_point: 'kyc' };
  nock(baseUrl).post('/v1/onboarding/sessions', params).reply(201, mockSession);

  const result = await onboarding.create(params);
  expect(result).toEqual(mockSession);
});

test('retrieve onboarding session', async () => {
  nock(baseUrl).get('/v1/onboarding/sessions/onb_123').reply(200, mockSession);

  const result = await onboarding.retrieve('onb_123');
  expect(result).toEqual(mockSession);
});

test('get (deprecated) delegates to retrieve', async () => {
  nock(baseUrl).get('/v1/onboarding/sessions/onb_123').reply(200, mockSession);

  const result = await onboarding.get('onb_123');
  expect(result).toEqual(mockSession);
});

test('update onboarding session', async () => {
  const updates = { status: 'completed' };
  const updated = { ...mockSession, status: 'completed' };

  nock(baseUrl).patch('/v1/onboarding/sessions/onb_123', updates).reply(200, updated);

  const result = await onboarding.update('onb_123', updates);
  expect(result).toEqual(updated);
});

test('payout onboarding session', async () => {
  const params = { payout_method_id: 'pm_456' };
  nock(baseUrl).post('/v1/onboarding/sessions/onb_123/payout', params).reply(200, mockSession);

  const result = await onboarding.payout('onb_123', params);
  expect(result).toEqual(mockSession);
});
