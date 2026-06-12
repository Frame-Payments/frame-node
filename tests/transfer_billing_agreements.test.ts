/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { TransferBillingAgreementsAPI } from '../src/api/transfer_billing_agreements-api';
import type {
  TransferBillingAgreement,
  CreateTransferBillingAgreementParams,
  UpdateTransferBillingAgreementParams,
} from '../src/types/transfer_billing_agreements';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const transferBillingAgreements = new TransferBillingAgreementsAPI(client);

const mockAgreement: TransferBillingAgreement = {
  id: 'tba_123',
  status: 'active',
  category: 'charge',
  effective_date: '2026-06-13',
  object: 'transfer_billing_agreement',
  account_id: 'acct_123',
  fee_plan: null,
  livemode: false,
  created: 1713435744,
  updated: 1713435744,
};

const listMeta = {
  page: 1,
  has_more: false,
  url: '/v1/transfer_billing_agreements',
  next: null,
  prev: null,
};

afterEach(() => nock.cleanAll());

test('create transfer billing agreement', async () => {
  const input: CreateTransferBillingAgreementParams = {
    account_id: 'acct_123',
    status: 'active',
    transfer_fee_plan_id: 'tfp_123',
    effective_date: '2026-06-13',
    category: 'charge',
  };

  nock(baseUrl).post('/v1/transfer_billing_agreements', input as any).reply(200, mockAgreement);

  const result = await transferBillingAgreements.create(input);
  expect(result).toEqual(mockAgreement);
});

test('get transfer billing agreement', async () => {
  nock(baseUrl).get('/v1/transfer_billing_agreements/tba_123').reply(200, mockAgreement);

  const result = await transferBillingAgreements.get('tba_123');
  expect(result).toEqual(mockAgreement);
});

test('update transfer billing agreement', async () => {
  const input: UpdateTransferBillingAgreementParams = { status: 'inactive' };
  const updated = { ...mockAgreement, status: 'inactive' as const };

  nock(baseUrl)
    .patch('/v1/transfer_billing_agreements/tba_123', input as any)
    .reply(200, updated);

  const result = await transferBillingAgreements.update('tba_123', input);
  expect(result).toEqual(updated);
});

test('list transfer billing agreements', async () => {
  const response = { data: [mockAgreement], meta: listMeta };

  nock(baseUrl)
    .get('/v1/transfer_billing_agreements')
    .query({ per_page: 10, page: 1 })
    .reply(200, response);

  const result = await transferBillingAgreements.list(10, 1);
  expect(result).toEqual(response);
});

test('iterate all transfer billing agreements across pages', async () => {
  nock(baseUrl)
    .get('/v1/transfer_billing_agreements')
    .query({ per_page: 20, page: 1 })
    .reply(200, {
      data: [mockAgreement],
      meta: { ...listMeta, has_more: true },
    });

  nock(baseUrl)
    .get('/v1/transfer_billing_agreements')
    .query({ per_page: 20, page: 2 })
    .reply(200, {
      data: [{ ...mockAgreement, id: 'tba_456' }],
      meta: { ...listMeta, page: 2, has_more: false },
    });

  const ids: string[] = [];
  for await (const agreement of await transferBillingAgreements.iterateAllTransferBillingAgreements()) {
    ids.push(agreement.id);
  }

  expect(ids).toEqual(['tba_123', 'tba_456']);
});
