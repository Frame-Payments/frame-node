import type { AxiosInstance } from 'axios';
import type {
  ProductPhase,
  ProductPhaseListResponse,
  CreateProductPhaseParams,
  UpdateProductPhaseParams
} from '../types/product_phases';
import { paginate } from '../utils/paginator';

export class ProductPhasesAPI {
  constructor(private client: AxiosInstance) {}

  async list(productId: string, per_page?: number, page?: number): Promise<ProductPhaseListResponse> {
    const resp = await this.client.get(`/v1/products/${productId}/phases`, { params: { per_page, page } });
    return resp.data;
  }

  async get(productId: string, phaseId: string): Promise<ProductPhase> {
    const resp = await this.client.get(`/v1/products/${productId}/phases/${phaseId}`);
    return resp.data;
  }

  async create(productId: string, params: CreateProductPhaseParams): Promise<ProductPhase> {
    const resp = await this.client.post(`/v1/products/${productId}/phases`, params);
    return resp.data;
  }

  async update(productId: string, phaseId: string, params: UpdateProductPhaseParams): Promise<ProductPhase> {
    const resp = await this.client.patch(`/v1/products/${productId}/phases/${phaseId}`, params);
    return resp.data;
  }

  async delete(productId: string, phaseId: string): Promise<ProductPhase> {
    const resp = await this.client.delete(`/v1/products/${productId}/phases/${phaseId}`);
    return resp.data;
  }

  async bulkUpdate(productId: string, phases: Array<{ id: string; [key: string]: unknown }>): Promise<ProductPhaseListResponse> {
    const resp = await this.client.patch(`/v1/products/${productId}/phases/bulk_update`, { phases });
    return resp.data;
  }

  async iterateAllProductPhases(productId: string, per_page = 20) {
    return paginate<ProductPhase>(async (page: number) => {
      const res = await this.client.get(`/v1/products/${productId}/phases`, { params: { per_page, page } });
      return res.data;
    }, per_page);
  }
}
