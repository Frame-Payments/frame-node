/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { OnboardingSessionsAPI } from '../src/api/onboarding_sessions-api';
import type { OnboardingSession } from '../src/types/onboarding_sessions';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const onboardingSessions = new OnboardingSessionsAPI(client);

const mockSession: OnboardingSession = {
  id: 'onb_sess_123',
  object: 'onboarding_session',
  account_id: 'acct_123',
  client_secret: 'onb_sess_secret_abc',
  steps: ['id_verification', 'payment_method'],
  return_url: null,
  expires_at: 1234567890,
  livemode: false,
};

test('create onboarding session', async () => {
  const input = { account_id: 'acct_123' };

  nock(baseUrl).post('/v1/onboarding_sessions', input).reply(201, mockSession);

  const result = await onboardingSessions.create(input);
  expect(result).toEqual(mockSession);
});

test('create onboarding session with steps and return_url', async () => {
  const input = {
    account_id: 'acct_123',
    steps: ['id_verification'],
    return_url: 'https://example.com/done',
  };

  nock(baseUrl).post('/v1/onboarding_sessions', input).reply(201, mockSession);

  const result = await onboardingSessions.create(input);
  expect(result).toEqual(mockSession);
});

test('get onboarding session by account', async () => {
  nock(baseUrl).get('/v1/onboarding_sessions').query({ account_id: 'acct_123' }).reply(200, mockSession);

  const result = await onboardingSessions.getByAccount('acct_123');
  expect(result).toEqual(mockSession);
});
