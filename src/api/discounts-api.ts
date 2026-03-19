import type { AxiosInstance } from 'axios';
import type {
  Discount,
  DiscountListResponse,
  ValidateDiscountsParams
} from '../types/discounts';
import { paginate } from '../utils/paginator';

export class DiscountsAPI {
  constructor(private client: AxiosInstance) {}

  async list(per_page?: number, page?: number): Promise<DiscountListResponse> {
    const resp = await this.client.get('/v1/discounts', { params: { per_page, page } });
    return resp.data;
  }

  async get(id: string): Promise<Discount> {
    const resp = await this.client.get(`/v1/discounts/${id}`);
    return resp.data;
  }

  async validate(params: ValidateDiscountsParams): Promise<Discount[]> {
    const resp = await this.client.post('/v1/discounts/validate', params);
    return resp.data;
  }

  async iterateAllDiscounts(per_page = 20) {
    return paginate<Discount>(async (page: number) => {
      const res = await this.client.get('/v1/discounts', { params: { per_page, page } });
      return res.data;
    }, per_page);
  }
}
