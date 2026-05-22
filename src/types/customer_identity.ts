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
  customer?: Record<string, unknown> | null;
  created: number;
  updated: number;
  pending: number | null;
  verified: number | null;
  failed: number | null;
}

export interface CreateCustomerIdentityVerificationParams {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone_number: string;
  ssn: string;
  address: Address;
}

export interface UploadDocumentsParams {
  documents: Array<{
    document_type: string;
    file_id?: string;
    metadata?: Record<string, unknown>;
  }>;
}

export interface ReactNativeFileDescriptor {
  uri: string;
  type?: string;
  name?: string;
}

export type NodeFilePayload =
  | Buffer
  | NodeJS.ReadableStream
  | string;

export interface IdentityDocumentUpload {
  document_type: string;
  field_name?: string;
  file: NodeFilePayload | ReactNativeFileDescriptor;
  content_type?: string;
  file_name?: string;
}
