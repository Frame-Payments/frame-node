import type { AxiosInstance } from 'axios';
import type {
  Dispute,
  DisputeListResponse,
  UpdateDisputeParams
} from '../types/disputes';

export class DisputesAPI {
  constructor(private client: AxiosInstance) {}

  async update(id: string, params: UpdateDisputeParams): Promise<Dispute> {
    const resp = await this.client.post(`/v1/disputes/${id}`, params);
    return resp.data;
  }

  async get(id: string): Promise<Dispute> {
    const resp = await this.client.get(`/v1/disputes/${id}`);
    return resp.data;
  }

  async list(per_page?: number, page?: number, charge?: string, charge_intent?: string): Promise<DisputeListResponse> {
    const resp = await this.client.get('/v1/disputes', { params: { per_page, page, charge, charge_intent } });
    return resp.data;
  }

  async close(id: string): Promise<Dispute> {
    const resp = await this.client.post(`/v1/disputes/${id}/close`);
    return resp.data;
  }
}