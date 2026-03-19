import type { AxiosInstance } from 'axios';
import type { Charge, ChargeTrace } from '../types/charges';

export class ChargesAPI {
  constructor(private client: AxiosInstance) {}

  async get(id: string): Promise<Charge> {
    const resp = await this.client.get(`/v1/charges/${id}`);
    return resp.data;
  }

  async trace(id: string): Promise<ChargeTrace> {
    const resp = await this.client.get(`/v1/charges/${id}/trace`);
    return resp.data;
  }
}
