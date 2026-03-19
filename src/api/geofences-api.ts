import type { AxiosInstance } from 'axios';
import type { Geofence, GeofenceListResponse } from '../types/geofences';
import { paginate } from '../utils/paginator';

export class GeofencesAPI {
  constructor(private client: AxiosInstance) {}

  async list(params?: { per_page?: number; page?: number }): Promise<GeofenceListResponse> {
    const resp = await this.client.get('/v1/geofences', { params });
    return resp.data;
  }

  async iterateAllGeofences(per_page = 20) {
    return paginate<Geofence>(async (page: number) => {
      const res = await this.client.get('/v1/geofences', { params: { per_page, page } });
      return res.data;
    }, per_page);
  }
}
