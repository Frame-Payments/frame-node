import type { AxiosInstance } from 'axios';
import type {
  SonarSession,
  CreateSonarSessionParams,
  UpdateSonarSessionParams
} from '../types/sonar_sessions';

export class SonarSessionsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateSonarSessionParams): Promise<SonarSession> {
    const resp = await this.client.post('/v1/sonar_sessions', params);
    return resp.data;
  }

  async update(id: string, params: UpdateSonarSessionParams): Promise<SonarSession> {
    const resp = await this.client.patch(`/v1/sonar_sessions/${id}`, params);
    return resp.data;
  }
}
