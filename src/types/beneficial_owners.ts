export interface BeneficialOwner {
  id: string;
  object: string;
  account_id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  suffix?: string | null;
  email: string;
  roles: string[];
  percent_ownership?: number | null;
  status: string;
  livemode: boolean;
  created: number;
  updated: number;
}

export interface BeneficialOwnerListResponse {
  data: BeneficialOwner[];
}

export interface CreateBeneficialOwnerParams {
  first_name: string;
  last_name: string;
  email: string;
  roles: string[];
  invite?: boolean;
  dob?: string;
  ssn?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  percent_ownership?: number;
}

export interface UpdateBeneficialOwnerParams {
  first_name?: string;
  last_name?: string;
  email?: string;
  ssn?: string;
  roles?: string[];
  percent_ownership?: number;
}
