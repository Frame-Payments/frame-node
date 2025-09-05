import type { AxiosInstance } from 'axios';
import type { Product, ProductListResponse, CreateProductParams, UpdateProductParams, SearchProductParams, DeletedProduct } from '../types/products';
import { paginate } from '../utils/paginator';

export class ProductsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateProductParams): Promise<Product> {
    const resp = await this.client.post('/v1/products', params);
    return resp.data;
  }

  async update(id: string, params: UpdateProductParams): Promise<Product> {
    const resp = await this.client.patch(`/v1/products/${id}`, params);
    return resp.data;
  }

  async get(id: string): Promise<Product> {
    const resp = await this.client.get(`/v1/products/${id}`);
    return resp.data;
  }

  async list(per_page?: number, page?: number): Promise<ProductListResponse> {
    const resp = await this.client.get('/v1/products', { params: { per_page, page } });
    return resp.data;
  }

  async iterateAllProducts(per_page = 20) {
    return paginate<Product>(async (page: number) => {
      const res = await this.client.get('/v1/products', {
        params: { per_page, page }
      });
      return res.data;
    }, per_page);
  }

  async search(params: SearchProductParams): Promise<ProductListResponse> {
    const resp = await this.client.get('/v1/products/search', { params });
    return resp.data;
  }

  async delete(id: string): Promise<DeletedProduct> {
    const resp = await this.client.delete(`/v1/products/${id}`);
    return resp.data;
  }
}