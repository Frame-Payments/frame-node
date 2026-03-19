import type { AxiosInstance } from 'axios';
import type {
  Coupon,
  CouponListResponse,
  CreateCouponParams,
  UpdateCouponParams
} from '../types/coupons';
import { paginate } from '../utils/paginator';

export class CouponsAPI {
  constructor(private client: AxiosInstance) {}

  async list(per_page?: number, page?: number): Promise<CouponListResponse> {
    const resp = await this.client.get('/v1/coupons', { params: { per_page, page } });
    return resp.data;
  }

  async get(id: string): Promise<Coupon> {
    const resp = await this.client.get(`/v1/coupons/${id}`);
    return resp.data;
  }

  async create(params: CreateCouponParams): Promise<Coupon> {
    const resp = await this.client.post('/v1/coupons', params);
    return resp.data;
  }

  async update(id: string, params: UpdateCouponParams): Promise<Coupon> {
    const resp = await this.client.patch(`/v1/coupons/${id}`, params);
    return resp.data;
  }

  async iterateAllCoupons(per_page = 20) {
    return paginate<Coupon>(async (page: number) => {
      const res = await this.client.get('/v1/coupons', { params: { per_page, page } });
      return res.data;
    }, per_page);
  }
}
