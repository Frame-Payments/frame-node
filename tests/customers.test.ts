/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { CustomersAPI } from '../src/api/customers-api';
import type { Customer } from '../src/types/customers';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const customers = new CustomersAPI(client);

const mockCustomer: Customer = {
  id: 'cus_123',
  name: 'Alice',
  email: 'alice@example.com',
  status: 'active',
  object: 'customer',
  payment_methods: [],
  created: 1234567890,
  updated: 1234567890,
  livemode: false,
  metadata: {},
};

test('create customer', async () => {
  const input = { name: 'Alice', email: 'alice@example.com' };

  nock(baseUrl).post('/v1/customers', input).reply(200, mockCustomer);

  const result = await customers.create(input as any);
  expect(result).toEqual(mockCustomer);
});

test('get customer', async () => {
  nock(baseUrl).get('/v1/customers/cus_123').reply(200, mockCustomer);

  const result = await customers.get('cus_123');
  expect(result).toEqual(mockCustomer);
});

test('update customer', async () => {
  const updates = { metadata: { vip: true } };
  const updated = { ...mockCustomer, ...updates };

  nock(baseUrl).patch('/v1/customers/cus_123', updates).reply(200, updated);

  const result = await customers.update('cus_123', updates as any);
  expect(result).toEqual(updated);
});

test('list customers', async () => {
  const response = {
    data: [mockCustomer],
    page: 1,
    per_page: 10,
    total: 1,
  };

  nock(baseUrl).get('/v1/customers').query({ per_page: 10, page: 1 }).reply(200, response);

  const result = await customers.list(10, 1);
  expect(result).toEqual(response);
});

test('search customers', async () => {
  const searchParams = { email: 'alice@example.com' };
  const response = {
    data: [mockCustomer],
    page: 1,
    per_page: 10,
    total: 1,
  };

  nock(baseUrl).get('/v1/customers/search').query(searchParams).reply(200, response);

  const result = await customers.search(searchParams as any);
  expect(result).toEqual(response);
});

test('delete customer', async () => {
  const response = { id: 'cus_123', deleted: true };

  nock(baseUrl).delete('/v1/customers/cus_123').reply(200, response);

  const result = await customers.delete('cus_123');
  expect(result).toEqual(response);
});

test('block customer', async () => {
  nock(baseUrl).post('/v1/customers/cus_123/block').reply(200, mockCustomer);

  const result = await customers.block('cus_123');
  expect(result).toEqual(mockCustomer);
});

test('unblock customer', async () => {
  nock(baseUrl).post('/v1/customers/cus_123/unblock').reply(200, mockCustomer);

  const result = await customers.unblock('cus_123');
  expect(result).toEqual(mockCustomer);
});