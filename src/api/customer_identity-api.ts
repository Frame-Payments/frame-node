import type { AxiosInstance } from 'axios';
import type {
    CustomerIdentityVerification,
    CreateCustomerIdentityVerificationParams,
    UploadDocumentsParams,
    IdentityDocumentUpload,
    ReactNativeFileDescriptor,
} from '../types/customer_identity';
import { maybePublishableKey, type RequestOptions } from '../client';

export class CustomerIdentityVerificationsAPI {
  constructor(private client: AxiosInstance) {}

  async create(
    params: CreateCustomerIdentityVerificationParams,
    opts?: RequestOptions,
  ): Promise<CustomerIdentityVerification> {
    const resp = await this.client.post('/v1/customer_identity_verifications', params, maybePublishableKey(opts));
    return resp.data;
  }

  async createForCustomer(
    customerId: string,
    opts?: RequestOptions,
  ): Promise<CustomerIdentityVerification> {
    const resp = await this.client.post(
      `/v1/customers/${customerId}/identity_verifications`,
      undefined,
      maybePublishableKey(opts),
    );
    return resp.data;
  }

  async get(id: string, opts?: RequestOptions): Promise<CustomerIdentityVerification> {
    const resp = await this.client.get(`/v1/customer_identity_verifications/${id}`, maybePublishableKey(opts));
    return resp.data;
  }

  async submitForVerification(id: string, opts?: RequestOptions): Promise<CustomerIdentityVerification> {
    const resp = await this.client.post(
      `/v1/customer_identity_verifications/${id}/submit`,
      undefined,
      maybePublishableKey(opts),
    );
    return resp.data;
  }

  async uploadDocuments(
    id: string,
    params: UploadDocumentsParams,
    opts?: RequestOptions,
  ): Promise<CustomerIdentityVerification> {
    const resp = await this.client.post(
      `/v1/customer_identity_verifications/${id}/upload_documents`,
      params,
      maybePublishableKey(opts),
    );
    return resp.data;
  }

  async uploadIdentityDocuments(
    id: string,
    documents: IdentityDocumentUpload[],
    opts?: RequestOptions,
  ): Promise<CustomerIdentityVerification> {
    if (documents.length === 0) {
      throw new Error('uploadIdentityDocuments: documents array must not be empty');
    }

    const form = makeFormData();
    for (const doc of documents) {
      appendFile(form, doc);
    }

    const baseOpts = opts ?? {};
    const callerHeaders = (baseOpts as { headers?: Record<string, string> }).headers ?? {};
    return this.client
      .post(
        `/v1/customer_identity_verifications/${id}/upload_documents`,
        form,
        maybePublishableKey({
          ...baseOpts,
          headers: { ...callerHeaders, 'Content-Type': 'multipart/form-data' },
        }),
      )
      .then((resp) => resp.data);
  }
}

interface FormDataLike {
  append(name: string, value: unknown, options?: { filename?: string; contentType?: string }): void;
}

function isReactNative(): boolean {
  const G: unknown = globalThis;
  if (typeof G !== 'object' || G === null) return false;
  const nav = (G as { navigator?: { product?: unknown } }).navigator;
  return typeof nav?.product === 'string' && nav.product === 'ReactNative';
}

// Pick FormData by runtime, not by whether `require('form-data')` succeeds:
// form-data is a transitive dep of axios so the require succeeds on RN too,
// but it doesn't accept RN's { uri, type, name } file shape.
function makeFormData(): FormDataLike {
  if (isReactNative()) {
    const G: unknown = globalThis;
    const Ctor = (G as { FormData?: new () => FormDataLike }).FormData;
    if (typeof Ctor !== 'function') {
      throw new Error(
        'React Native runtime detected but globalThis.FormData is missing. Polyfill required.',
      );
    }
    return new Ctor();
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const FormDataCtor = require('form-data');
  return new FormDataCtor() as FormDataLike;
}

function isReactNativeFileDescriptor(file: unknown): file is ReactNativeFileDescriptor {
  return (
    typeof file === 'object' &&
    file !== null &&
    typeof (file as { uri?: unknown }).uri === 'string'
  );
}

function appendFile(form: FormDataLike, doc: IdentityDocumentUpload): void {
  const fieldName = doc.field_name ?? doc.document_type;
  const file = doc.file;

  if (isReactNativeFileDescriptor(file)) {
    form.append(fieldName, file);
    return;
  }

  const fileOptions: { filename?: string; contentType?: string } = {};
  if (doc.file_name !== undefined) fileOptions.filename = doc.file_name;
  if (doc.content_type !== undefined) fileOptions.contentType = doc.content_type;
  form.append(fieldName, file, fileOptions);
}
