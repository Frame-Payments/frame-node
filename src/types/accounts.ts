import type { PaginationMeta } from './customers';

export interface Account {
  id: string;
  object: string;
  type: string;
  status: string;
  external_id?: string | null;
  metadata?: Record<string, unknown>;
  profile?: Record<string, unknown> | null;
  capabilities?: unknown[];
  created: number;
  updated: number;
  livemode: boolean;
}

export interface AccountListResponse {
  meta: PaginationMeta;
  data: Account[];
}

export interface ListAccountsParams {
  page?: number;
  per_page?: number;
  status?: string;
  type?: string;
  external_id?: string;
  include_disabled?: boolean;
}

export interface TermsOfService {
  accepted_at?: string;
  ip_address?: string;
  user_agent?: string;
}

export interface AccountProfileIndividualName {
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
}

export interface AccountProfileAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface AccountProfilePhone {
  number?: string;
  country_code?: string;
}

export interface AccountProfileIndividual {
  name: AccountProfileIndividualName;
  email: string;
  phone?: AccountProfilePhone;
  address?: AccountProfileAddress;
  dob?: string;
  ssn?: string;
}

export interface AccountProfileBusiness {
  legal_business_name: string;
  doing_business_as?: string;
  business_type: string;
  email: string;
  website?: string;
  description?: string;
  phone?: AccountProfilePhone;
  address?: AccountProfileAddress;
  ein?: string;
  mcc?: string;
  naics?: string;
}

export interface CreateAccountProfile {
  individual?: AccountProfileIndividual;
  business?: AccountProfileBusiness;
}

export interface CreateAccountParams {
  type: string;
  external_id?: string;
  terms_of_service?: TermsOfService;
  metadata?: Record<string, unknown>;
  profile: CreateAccountProfile;
}

export interface UpdateAccountParams {
  external_id?: string;
  metadata?: Record<string, unknown>;
  profile?: Partial<CreateAccountProfile>;
}
