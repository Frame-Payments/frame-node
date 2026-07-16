import type { AxiosInstance } from 'axios';
import type {
  PromotionCode,
  PromotionCodeListResponse,
  CreatePromotionCodeParams,
  UpdatePromotionCodeParams
} from '../types/promotion_codes';
import { paginate } from '../utils/paginator';

export class PromotionCodesAPI {
  constructor(private client: AxiosInstance) {}

  async list(per_page?: number, page?: number): Promise<PromotionCodeListResponse> {
    const resp = await this.client.get('/v1/promotion_codes', { params: { per_page, page } });
    return resp.data;
  }

  async retrieve(id: string): Promise<PromotionCode> {
    const resp = await this.client.get(`/v1/promotion_codes/${id}`);
    return resp.data;
  }

  /** @deprecated Use `retrieve` instead. Removed at v2. */
  async get(id: string): Promise<PromotionCode> {
    return this.retrieve(id);
  }

  async create(params: CreatePromotionCodeParams): Promise<PromotionCode> {
    const resp = await this.client.post('/v1/promotion_codes', params);
    return resp.data;
  }

  async update(id: string, params: UpdatePromotionCodeParams): Promise<PromotionCode> {
    const resp = await this.client.patch(`/v1/promotion_codes/${id}`, params);
    return resp.data;
  }

  async iterateAllPromotionCodes(per_page = 20) {
    return paginate<PromotionCode>(async (page: number) => {
      const res = await this.client.get('/v1/promotion_codes', { params: { per_page, page } });
      return res.data;
    }, per_page);
  }
}
