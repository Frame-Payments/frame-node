export interface CapabilityRequirement {
  id: string;
  object: string;
  type: string;
  status: string;
  source?: string;
}

export interface Capability {
  id: string;
  object: string;
  name: string;
  status: string;
  disabled_reason?: string | null;
  requirements?: CapabilityRequirement[];
  created_at?: string;
  updated_at?: string;
}

export interface RequestCapabilitiesParams {
  capabilities: string[];
}
