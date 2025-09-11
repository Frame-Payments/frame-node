import nock from 'nock';
import axios from 'axios';
import { InvoicesAPI } from '../src/api/invoices-api';
import { type Invoice, type DeleteInvoiceResponse, InvoiceStatus, CollectionMethod } from '../src/types/invoices';

const baseURL = 'https://api.framepayments.com';
const client = axios.create({ baseURL });
const invoices = new InvoicesAPI(client);

const mockInvoice: Invoice = {
    id: 'inv_123',
    customer: {
        id: 'cust_123',
        object: 'customer',
        name: 'customer1'
    },
    currency: 'usd',
    total: 9900,
    status: InvoiceStatus.DRAFT,
    collection_method: CollectionMethod.AUTO_CHARGE,
    net_terms: 30,
    object: 'invoice',
    metadata: {},
    created: 1720200000,
    updated: 1720200000,
    livemode: false,
    line_items: []
};

test('create invoice', async () => {
  const input = {
    customer: 'cus_456',
    currency: 'usd',
    description: 'New invoice',
    line_items: [],
  };

  nock(baseURL).post('/v1/invoices', input).reply(200, mockInvoice);

  const result = await invoices.create(input as any);
  expect(result).toEqual(mockInvoice);
});

test('update invoice', async () => {
  const updates = { metadata: { project: 'XYZ' } };
  const updatedInvoice = { ...mockInvoice, ...updates };

  nock(baseURL)
    .patch(`/v1/invoices/${mockInvoice.id}`, updates)
    .reply(200, updatedInvoice);

  const result = await invoices.update(mockInvoice.id, updates as any);
  expect(result).toEqual(updatedInvoice);
});

test('get invoice', async () => {
  nock(baseURL)
    .get(`/v1/invoices/${mockInvoice.id}`)
    .reply(200, mockInvoice);

  const result = await invoices.get(mockInvoice.id);
  expect(result).toEqual(mockInvoice);
});

test('list invoices', async () => {
  const response = {
    meta: {
      page: 1,
      has_more: false,
      url: '/v1/invoices',
      prev: null,
      next: null
    },
    data: [mockInvoice]
  };

  nock(baseURL)
    .get('/v1/invoices')
    .query(true)
    .reply(200, response);

  const result = await invoices.list(10, 1);
  expect(result).toEqual(response);
});

test('delete invoice', async () => {
  const deleted: DeleteInvoiceResponse = {
    object: 'invoice',
    deleted: true
  };

  nock(baseURL)
    .delete(`/v1/invoices/${mockInvoice.id}`)
    .reply(200, deleted);

  const result = await invoices.delete(mockInvoice.id);
  expect(result).toEqual(deleted);
});

test('issue invoice', async () => {
  const issuedInvoice = { ...mockInvoice, status: 'open' };

  nock(baseURL)
    .post(`/v1/invoices/${mockInvoice.id}/issue`)
    .reply(200, issuedInvoice);

  const result = await invoices.issue(mockInvoice.id);
  expect(result).toEqual(issuedInvoice);
});