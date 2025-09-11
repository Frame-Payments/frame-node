/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { ProductsAPI } from '../src/api/products-api';
import { type Product, type CreateProductParams, type UpdateProductParams, ProductPurchaseType } from '../src/types/products';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const products = new ProductsAPI(client)

const mockProduct: Product = {
  id: 'prod_123',
  name: 'Gold Plan',
  description: 'Best plan for VIPs',
  default_price: 9900,
  livemode: false,
  image: null,
  url: null,
  shippable: false,
  object: 'product',
  active: true,
  metadata: {},
  created: 1713435744,
  updated: 1713435744
};

test('create product', async () => {
  const input: CreateProductParams = {
    name: 'Gold Plan',
    description: 'Best plan for VIPs',
    default_price: 9900,
    purchase_type: ProductPurchaseType.RECURRING
  };

  nock(baseUrl).post('/v1/products', input as any).reply(200, mockProduct);

  const result = await products.create(input);
  expect(result).toEqual(mockProduct);
});

test('update product', async () => {
  const input: UpdateProductParams = {
    name: 'Gold Plan',
    description: 'Best plan for VIPs',
    default_price: 9900
  };

  nock(baseUrl).patch('/v1/products/product_123', input as any).reply(200, mockProduct);

  const result = await products.update('product_123', input);
  expect(result).toEqual(mockProduct);
});

test('get product', async () => {
  nock(baseUrl).get('/v1/products/prod_123').reply(200, mockProduct);

  const result = await products.get('prod_123');
  expect(result).toEqual(mockProduct);
});

test('list products', async () => {
  nock(baseUrl).get('/v1/products').query(true).reply(200, {
    data: [mockProduct],
    meta: {
      page: 1,
      has_more: false,
      url: '/v1/products',
      next: null,
      prev: null
    }
  });

  const result = await products.list();
  expect(result.data.length).toBeGreaterThan(0);
  expect(result.data[0].id).toBe('prod_123');
});

test('search products', async () => {
  nock(baseUrl)
    .get('/v1/products/search')
    .query(true)
    .reply(200, {
      data: [mockProduct],
      meta: {
        page: 1,
        has_more: false,
        url: '/v1/products/search?name=Gold&active=true',
        next: null,
        prev: null
      }
    });

  const result = await products.search({ name: 'Gold', active: true });
  expect(result.data[0].name).toBe('Gold Plan');
});

test('delete product', async () => {
  nock(baseUrl)
    .delete('/v1/products/prod_123')
    .reply(200, { id: 'prod_123', object: 'product', deleted: true });

  const result = await products.delete('prod_123');
  expect(result.deleted).toBe(true);
});