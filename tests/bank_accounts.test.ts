/// <reference types="jest" />

import { BankAccountsAPI } from '../src/api/bank_accounts-api';
import { PaymentAccountType } from '../src/types/payment_methods';
import { BankAccount, CreateBankAccountParams } from '../src/types/bank_accounts';
import nock from 'nock';
import { createApiClient } from '../src/client';

const baseUrl = 'https://api.framepayments.com';
const client = createApiClient({ apiKey: 'sk_test', publishableKey: 'pk_test' });
const bankAccounts = new BankAccountsAPI(client);

const mockBankAccount: BankAccount = {
  id: 'ba_1234567890abcdef',
  object: 'bank_account',
  routing_number: '110000000',
  account_number_last_4: '6789',
  account_type: PaymentAccountType.CHECKING,
  bank_name: 'Test Bank',
  processor_name: 'plaid',
  status: 'active',
  customer_id: 'cus_1234567890abcdef',
  account_id: null,
  created: 1640995200,
  updated: 1640995200,
  livemode: false,
};

afterEach(() => {
  nock.cleanAll();
});

test('create bank account', async () => {
  const input: CreateBankAccountParams = {
    processor: 'plaid',
    processor_token: 'processor-sandbox-token',
    customer_id: 'cus_1234567890abcdef',
  };
  nock(baseUrl).post('/v1/bank_accounts', input).reply(201, mockBankAccount);

  const result = await bankAccounts.create(input);
  expect(result).toEqual(mockBankAccount);
});

test('retrieve bank account', async () => {
  nock(baseUrl).get('/v1/bank_accounts/ba_1234567890abcdef').reply(200, mockBankAccount);

  const result = await bankAccounts.retrieve('ba_1234567890abcdef');
  expect(result).toEqual(mockBankAccount);
});
