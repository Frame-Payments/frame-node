/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { CustomerIdentityVerificationsAPI } from '../src/api/customer_identity-api';
import { VerificationStatus, type CustomerIdentityVerification } from '../src/types/customer_identity';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const identityAPI = new CustomerIdentityVerificationsAPI(client);

const mockVerification: CustomerIdentityVerification = {
    id: 'civ_123',
    status: VerificationStatus.PENDING,
    created: 1625256000,
    updated: 1625257000,
    object: 'customer_identity_verification',
    verification_url: null,
    pending: null,
    verified: null,
    failed: null
};

test('create identity verification', async () => {
  const params = { customer: 'cus_456' };

  nock(baseUrl)
    .post('/v1/customer_identity_verifications', params)
    .reply(200, mockVerification);

  const result = await identityAPI.create(params as any);
  expect(result).toEqual(mockVerification);
});

test('get identity verification by id', async () => {
  nock(baseUrl)
    .get('/v1/customer_identity_verifications/civ_123')
    .reply(200, mockVerification);

  const result = await identityAPI.get('civ_123');
  expect(result).toEqual(mockVerification);
});

test('upload documents for identity verification', async () => {
  const params = {
    documents: [
      { document_type: 'drivers_license', file_id: 'file_123' }
    ]
  };

  nock(baseUrl)
    .post('/v1/customer_identity_verifications/civ_123/upload_documents', params)
    .reply(200, mockVerification);

  const result = await identityAPI.uploadDocuments('civ_123', params);
  expect(result).toEqual(mockVerification);
});

test('createForCustomer → POST /v1/customers/{id}/identity_verifications', async () => {
  nock(baseUrl)
    .post('/v1/customers/cus_456/identity_verifications')
    .reply(200, mockVerification);

  const result = await identityAPI.createForCustomer('cus_456');
  expect(result).toEqual(mockVerification);
});

test('submitForVerification → POST /v1/customer_identity_verifications/{id}/submit', async () => {
  nock(baseUrl)
    .post('/v1/customer_identity_verifications/civ_123/submit')
    .reply(200, { ...mockVerification, status: VerificationStatus.PENDING });

  const result = await identityAPI.submitForVerification('civ_123');
  expect(result.status).toBe(VerificationStatus.PENDING);
});

test('uploadIdentityDocuments (Node Buffer) → multipart POST with parts visible in body', async () => {
  let capturedBody: Buffer | undefined;
  let capturedContentType: string | undefined;

  nock(baseUrl)
    .post('/v1/customer_identity_verifications/civ_123/upload_documents')
    .matchHeader('content-type', (val) => {
      capturedContentType = val;
      return typeof val === 'string' && val.includes('multipart/form-data');
    })
    .matchHeader('X-Frame-Use-Publishable-Key', '1')
    .reply(200, (_uri, requestBody) => {
      capturedBody = Buffer.isBuffer(requestBody)
        ? requestBody
        : Buffer.from(typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody));
      return mockVerification;
    });

  const result = await identityAPI.uploadIdentityDocuments(
    'civ_123',
    [
      {
        document_type: 'drivers_license_front',
        file: Buffer.from('fake-front-bytes'),
        file_name: 'front.jpg',
        content_type: 'image/jpeg',
      },
    ],
    { usePublishableKey: true },
  );
  expect(result).toEqual(mockVerification);

  expect(capturedContentType).toMatch(/multipart\/form-data; boundary=/);
  const bodyStr = capturedBody?.toString('binary') ?? '';
  expect(bodyStr).toContain('name="drivers_license_front"');
  expect(bodyStr).toContain('filename="front.jpg"');
  expect(bodyStr).toContain('Content-Type: image/jpeg');
  expect(bodyStr).toContain('fake-front-bytes');
});

test('uploadIdentityDocuments (multiple documents) emits one part per entry', async () => {
  let capturedBody: Buffer | undefined;

  nock(baseUrl)
    .post('/v1/customer_identity_verifications/civ_123/upload_documents')
    .reply(200, (_uri, requestBody) => {
      capturedBody = Buffer.isBuffer(requestBody)
        ? requestBody
        : Buffer.from(typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody));
      return mockVerification;
    });

  await identityAPI.uploadIdentityDocuments('civ_123', [
    { document_type: 'front', file: Buffer.from('A'), file_name: 'a.jpg', content_type: 'image/jpeg' },
    { document_type: 'back', file: Buffer.from('B'), file_name: 'b.jpg', content_type: 'image/jpeg' },
    { document_type: 'selfie', file: Buffer.from('C'), file_name: 'c.jpg', content_type: 'image/jpeg' },
  ]);

  const bodyStr = capturedBody?.toString('binary') ?? '';
  expect(bodyStr).toContain('name="front"');
  expect(bodyStr).toContain('name="back"');
  expect(bodyStr).toContain('name="selfie"');
});

test('uploadIdentityDocuments rejects an empty documents array', async () => {
  await expect(identityAPI.uploadIdentityDocuments('civ_123', [])).rejects.toThrow(/must not be empty/);
});

test('uploadIdentityDocuments honors field_name override', async () => {
  let capturedBody: Buffer | undefined;

  nock(baseUrl)
    .post('/v1/customer_identity_verifications/civ_123/upload_documents')
    .reply(200, (_uri, requestBody) => {
      capturedBody = Buffer.isBuffer(requestBody)
        ? requestBody
        : Buffer.from(typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody));
      return mockVerification;
    });

  await identityAPI.uploadIdentityDocuments('civ_123', [
    {
      document_type: 'drivers_license_front',
      field_name: 'document_front',
      file: Buffer.from('x'),
      file_name: 'x.jpg',
      content_type: 'image/jpeg',
    },
  ]);

  const bodyStr = capturedBody?.toString('binary') ?? '';
  expect(bodyStr).toContain('name="document_front"');
  expect(bodyStr).not.toContain('name="drivers_license_front"');
});

test('uploadIdentityDocuments (React Native path) detects RN runtime and uses globalThis.FormData', async () => {
  type AppendArgs = [string, { uri: string; type?: string; name?: string }];
  const appendCalls: AppendArgs[] = [];

  const originalNavigator = (globalThis as { navigator?: unknown }).navigator;
  const originalFormData = (globalThis as { FormData?: unknown }).FormData;
  const originalAdapter = (client.defaults as { adapter?: unknown }).adapter;

  (globalThis as { navigator?: unknown }).navigator = { product: 'ReactNative' };

  class MockRNFormData {
    append(name: string, value: { uri: string; type?: string; name?: string }) {
      appendCalls.push([name, value]);
    }
  }
  (globalThis as { FormData?: unknown }).FormData = MockRNFormData;

  let capturedData: unknown;
  (client.defaults as { adapter?: unknown }).adapter = async (config: { data: unknown }) => {
    capturedData = config.data;
    return {
      data: mockVerification,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  };

  try {
    await identityAPI.uploadIdentityDocuments(
      'civ_123',
      [
        {
          document_type: 'drivers_license_front',
          file: { uri: 'file:///tmp/front.jpg', type: 'image/jpeg', name: 'front.jpg' },
        },
      ],
      { usePublishableKey: true },
    );

    expect(capturedData).toBeInstanceOf(MockRNFormData);
    expect(appendCalls).toHaveLength(1);
    expect(appendCalls[0][0]).toBe('drivers_license_front');
    expect(appendCalls[0][1]).toEqual({
      uri: 'file:///tmp/front.jpg',
      type: 'image/jpeg',
      name: 'front.jpg',
    });
  } finally {
    if (originalNavigator === undefined) {
      delete (globalThis as { navigator?: unknown }).navigator;
    } else {
      (globalThis as { navigator?: unknown }).navigator = originalNavigator;
    }
    if (originalFormData === undefined) {
      delete (globalThis as { FormData?: unknown }).FormData;
    } else {
      (globalThis as { FormData?: unknown }).FormData = originalFormData;
    }
    (client.defaults as { adapter?: unknown }).adapter = originalAdapter;
  }
});

test('uploadIdentityDocuments preserves caller-supplied headers alongside Content-Type', async () => {
  nock(baseUrl)
    .post('/v1/customer_identity_verifications/civ_123/upload_documents')
    .matchHeader('X-Trace-Id', 'trace-abc')
    .matchHeader('content-type', (val) => typeof val === 'string' && val.includes('multipart/form-data'))
    .reply(200, mockVerification);

  await identityAPI.uploadIdentityDocuments(
    'civ_123',
    [
      {
        document_type: 'front',
        file: Buffer.from('x'),
        file_name: 'x.jpg',
        content_type: 'image/jpeg',
      },
    ],
    // @ts-expect-error: RequestOptions doesn't include headers, but uploadIdentityDocuments forwards them.
    { headers: { 'X-Trace-Id': 'trace-abc' } },
  );
});