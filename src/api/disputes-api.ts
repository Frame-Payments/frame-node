import type { AxiosInstance } from 'axios';
import type {
  Dispute,
  DisputeListResponse,
  UpdateDisputeParams,
  CreateDisputeDocumentParams,
  DisputeDocument
} from '../types/disputes';

export class DisputesAPI {
  constructor(private client: AxiosInstance) {}

  async update(id: string, params: UpdateDisputeParams): Promise<Dispute> {
    const resp = await this.client.patch(`/v1/disputes/${id}`, params);
    return resp.data;
  }

  async retrieve(id: string): Promise<Dispute> {
    const resp = await this.client.get(`/v1/disputes/${id}`);
    return resp.data;
  }

  /** @deprecated Use `retrieve` instead. Removed at v2. */
  async get(id: string): Promise<Dispute> {
    return this.retrieve(id);
  }

  async list(per_page?: number, page?: number, charge?: string, charge_intent?: string): Promise<DisputeListResponse> {
    const resp = await this.client.get('/v1/disputes', { params: { per_page, page, charge, charge_intent } });
    return resp.data;
  }

  async createDocument(id: string, params: CreateDisputeDocumentParams): Promise<DisputeDocument> {
    const resp = await this.client.post(`/v1/disputes/${id}/documents`, params);
    return resp.data;
  }
}