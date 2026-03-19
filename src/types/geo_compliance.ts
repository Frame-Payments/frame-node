export interface GeoComplianceStatus {
  status: string;
  reason?: string;
  geofence?: Record<string, unknown>;
  sonar_session_id?: string;
  evaluated_at: number;
}
