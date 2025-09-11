import type { Address } from "./customers";

export enum VerificationStatus { 
  INCOMPLETE = 'incomplete',
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed'
}

export interface CustomerIdentityVerification {
  id: string;
  object: string;
  status: VerificationStatus;
  verification_url: string | null;
  created: number;
  updated: number;
  pending: number | null;
  verified: number | null;
  failed: number | null;
}

export interface CreateCustomerIdentityVerificationParams {
  first_name: string;
  last_name: string;
  date_of_birth: string; // YYYY-MM-DD
  email: string;
  phone_number: string;
  ssn: string; // XXX-XX-XXXX or XXXXXXXXXX
  address: Address;
}