import type { AxiosInstance } from 'axios';
import type {
    ChargeIntent,
    ChargeIntentListResponse,
    CreateChargeIntentParams,
    UpdateChargeIntentParams
} from '../types/charge_intents';
import { paginate } from '../utils/paginator';

export class ChargeIntentsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateChargeIntentParams): Promise<ChargeIntent> {
    const resp = await this.client.post('/v1/charge_intents', params);
    return resp.data;
  }

  async update(id: string, params: UpdateChargeIntentParams): Promise<ChargeIntent> {
    const resp = await this.client.patch(`/v1/charge_intents/${id}`, params);
    return resp.data;
  }

  async get(id: string): Promise<ChargeIntent> {
    const resp = await this.client.get(`/v1/charge_intents/${id}`);
    return resp.data;
  }

  async list(per_page?: number, page?: number): Promise<ChargeIntentListResponse> {
    const resp = await this.client.get('/v1/charge_intents', { params: { per_page, page } });
    return resp.data;
  }

  async iterateAllChargeIntents(per_page = 20) {
          return paginate<ChargeIntent>(async (page: number) => {
            const res = await this.client.get('/v1/charge_intents', {
              params: { per_page, page }
            });
            return res.data;
          }, per_page);
        }

  async cancel(id: string): Promise<ChargeIntent> {
    const resp = await this.client.post(`/v1/charge_intents/${id}/cancel`);
    return resp.data;
  }

  async confirm(id: string): Promise<ChargeIntent> {
    const resp = await this.client.post(`/v1/charge_intents/${id}/confirm`);
    return resp.data;
  }

  async capture(id: string): Promise<ChargeIntent> {
    const resp = await this.client.post(`/v1/charge_intents/${id}/capture`);
    return resp.data;
  }
}