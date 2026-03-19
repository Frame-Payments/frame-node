import type { AxiosInstance } from 'axios';
import type {
  ChargeSession,
  CreateChargeSessionParams,
  UpdateChargeSessionParams
} from '../types/charge_sessions';

export class ChargeSessionsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateChargeSessionParams): Promise<ChargeSession> {
    const resp = await this.client.post('/v1/charge_sessions', params);
    return resp.data;
  }

  async update(id: string, params: UpdateChargeSessionParams): Promise<ChargeSession> {
    const resp = await this.client.patch(`/v1/charge_sessions/${id}`, params);
    return resp.data;
  }
}
