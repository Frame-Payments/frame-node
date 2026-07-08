import nock from 'nock';
import axios from 'axios';
import { MerchantBalanceAPI } from '../src/api/merchant_balance-api';
import type { MerchantBalance } from '../src/types/merchant_balance';

const baseURL = 'https://api.framepayments.com';
const client = axios.create({ baseURL });
const merchantBalance = new MerchantBalanceAPI(client);

const mockBalance: MerchantBalance = {
  merchant_id: 'mer_123',
  currency: 'USD',
  dots_balance: 50000.0,
  available_for_payout: 40000.0,
  reserved_amount: 5000.0,
  pending_payouts: 5000.0,
  last_updated_at: '2025-04-20T00:00:00Z',
  source: 'api',
  status: 'AVAILABLE',
};

test('retrieve → GET /v1/merchant_balance (no id)', async () => {
  nock(baseURL).get('/v1/merchant_balance').reply(200, mockBalance);

  const result = await merchantBalance.retrieve();
  expect(result).toEqual(mockBalance);
});

test('retrieve surfaces an unavailable balance', async () => {
  // The documented "unavailable" variant carries only status + reason_code and
  // omits the money fields — typing it as MerchantBalance guards that the type
  // actually permits that shape (money fields optional).
  const unavailable: MerchantBalance = {
    status: 'UNAVAILABLE',
    reason_code: 'DOTS_API_ERROR',
  };
  nock(baseURL).get('/v1/merchant_balance').reply(200, unavailable);

  const result = await merchantBalance.retrieve();
  expect(result.status).toBe('UNAVAILABLE');
  expect(result.reason_code).toBe('DOTS_API_ERROR');
  expect(result.dots_balance).toBeUndefined();
});
