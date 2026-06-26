/// <reference types="jest" />

import nock from 'nock';
import {
  createApiClient,
  createOnboardingSessionStore,
  withPublishableKey,
  maybePublishableKey,
} from '../src/client';
import { FrameAPIError } from '../src/errors/frame_api_error';
import { FrameSDK } from '../src';

const baseUrl = 'https://api.framepayments.com';

afterEach(() => {
  nock.cleanAll();
});

describe('createApiClient — key routing', () => {
  test('uses the secret key by default', async () => {
    const client = createApiClient({ apiKey: 'sk_test_1', publishableKey: 'pk_test_1' });

    nock(baseUrl, {
      reqheaders: { authorization: 'Bearer sk_test_1' },
    })
      .get('/v1/customers')
      .reply(200, { data: [] });

    const resp = await client.get('/v1/customers');
    expect(resp.status).toBe(200);
  });

  test('uses the publishable key when the per-call flag is set', async () => {
    const client = createApiClient({ apiKey: 'sk_test_1', publishableKey: 'pk_test_1' });

    nock(baseUrl, {
      reqheaders: { authorization: 'Bearer pk_test_1' },
    })
      .get('/v1/config/evervault')
      .reply(200, { app_id: 'a', team_id: 't' });

    const resp = await client.get('/v1/config/evervault', withPublishableKey());
    expect(resp.status).toBe(200);
  });

  test('throws when the publishable key is requested but not configured', async () => {
    const client = createApiClient({ apiKey: 'sk_only' });

    await expect(client.get('/v1/config/evervault', withPublishableKey())).rejects.toThrow(FrameAPIError);
    await expect(client.get('/v1/config/evervault', withPublishableKey())).rejects.toThrow(
      /publishable key is not configured/,
    );
  });

  test('throws when the api key is requested but not configured', async () => {
    const client = createApiClient({ publishableKey: 'pk_only' });

    await expect(client.get('/v1/customers')).rejects.toThrow(FrameAPIError);
    await expect(client.get('/v1/customers')).rejects.toThrow(/API key is not configured/);
  });

  test('rejects when neither key is supplied', () => {
    expect(() => createApiClient({})).toThrow(/at least one of/);
  });

  test('strips the publishable flag header before sending', async () => {
    const client = createApiClient({ apiKey: 'sk_test', publishableKey: 'pk_test' });

    nock(baseUrl)
      .matchHeader('X-Frame-Use-Publishable-Key', (val: string | undefined) => val === undefined)
      .post('/v1/config/evervault')
      .reply(200, {});

    await client.post('/v1/config/evervault', undefined, withPublishableKey());
  });
});

describe('withPublishableKey / maybePublishableKey helpers', () => {
  test('withPublishableKey adds the routing header by default', () => {
    const cfg = withPublishableKey();
    expect((cfg.headers as Record<string, string>)['X-Frame-Use-Publishable-Key']).toBe('1');
  });

  test('withPublishableKey({ usePublishableKey: false }) omits the routing header', () => {
    const cfg = withPublishableKey({ usePublishableKey: false });
    expect(cfg.headers).toBeUndefined();
  });

  test('maybePublishableKey defaults to no routing header', () => {
    const cfg = maybePublishableKey();
    expect(cfg.headers).toBeUndefined();
  });

  test('maybePublishableKey({ usePublishableKey: true }) opts in', () => {
    const cfg = maybePublishableKey({ usePublishableKey: true });
    expect((cfg.headers as Record<string, string>)['X-Frame-Use-Publishable-Key']).toBe('1');
  });

  test('helpers preserve user-supplied headers', () => {
    const cfg = withPublishableKey({ headers: { 'X-Trace-Id': 'abc' } });
    expect((cfg.headers as Record<string, string>)['X-Trace-Id']).toBe('abc');
    expect((cfg.headers as Record<string, string>)['X-Frame-Use-Publishable-Key']).toBe('1');
  });

  test('withPublishableKey({ usePublishableKey: false }) preserves user headers', () => {
    const cfg = withPublishableKey({ usePublishableKey: false, headers: { 'X-Trace-Id': 'abc' } });
    expect((cfg.headers as Record<string, string>)['X-Trace-Id']).toBe('abc');
    expect((cfg.headers as Record<string, string>)['X-Frame-Use-Publishable-Key']).toBeUndefined();
  });

  test('maybePublishableKey threads authToken into the smuggle header', () => {
    const cfg = maybePublishableKey({ authToken: 'ci_1_secret_x' });
    expect((cfg.headers as Record<string, string>)['X-Frame-Auth-Token']).toBe('ci_1_secret_x');
    expect((cfg.headers as Record<string, string>)['X-Frame-Use-Publishable-Key']).toBeUndefined();
  });

  test('authToken and usePublishableKey can be combined and both ride through', () => {
    const cfg = maybePublishableKey({ authToken: 'ci_1_secret_x', usePublishableKey: true });
    expect((cfg.headers as Record<string, string>)['X-Frame-Auth-Token']).toBe('ci_1_secret_x');
    expect((cfg.headers as Record<string, string>)['X-Frame-Use-Publishable-Key']).toBe('1');
  });

  test('no authToken means no smuggle header', () => {
    const cfg = maybePublishableKey();
    expect(cfg.headers).toBeUndefined();
  });
});

describe('response interceptor — error paths', () => {
  test('4xx response is wrapped as FrameAPIError with parsed envelope', async () => {
    const client = createApiClient({ apiKey: 'sk_test' });

    nock(baseUrl).get('/v1/customers').reply(422, {
      code: 'card_declined',
      message: 'Card was declined',
    });

    await expect(client.get('/v1/customers')).rejects.toMatchObject({
      code: 'card_declined',
      status: 422,
      message: 'Card was declined',
    });
  });

  test('5xx response wraps with unknown_error fallback when body lacks code/message', async () => {
    const client = createApiClient({ apiKey: 'sk_test' });

    nock(baseUrl).get('/v1/customers').reply(500, {});

    await expect(client.get('/v1/customers')).rejects.toMatchObject({
      code: 'unknown_error',
      status: 500,
      message: 'An error occurred',
    });
  });

  test('network-layer failure surfaces as FrameAPIError with code "network_error"', async () => {
    const client = createApiClient({ apiKey: 'sk_test' });

    nock.disableNetConnect();
    try {
      await expect(client.get('/v1/customers')).rejects.toMatchObject({
        code: 'network_error',
        status: 0,
      });
    } finally {
      nock.enableNetConnect();
    }
  });

  test('network-layer FrameAPIError.raw does NOT leak the Authorization bearer', async () => {
    const client = createApiClient({ apiKey: 'sk_SECRET_VALUE', publishableKey: 'pk_test' });

    nock.disableNetConnect();
    try {
      await client.get('/v1/customers');
      fail('expected client.get to reject');
    } catch (err) {
      const fae = err as FrameAPIError;
      const raw = JSON.stringify(fae.raw);
      expect(raw).not.toContain('sk_SECRET_VALUE');
      expect(raw).not.toContain('Bearer');
      expect(raw).not.toContain('X-Frame-Use-Publishable-Key');
      expect(fae.code).toBe('network_error');
      expect(fae.status).toBe(0);
    } finally {
      nock.enableNetConnect();
    }
  });
});

describe('defaultHeaders — per-request attachment', () => {
  test('attaches defaultHeaders to every outgoing request', async () => {
    const client = createApiClient({
      apiKey: 'sk_test',
      defaultHeaders: { ip_address: '203.0.113.42' },
    });

    nock(baseUrl, {
      reqheaders: { ip_address: '203.0.113.42', authorization: 'Bearer sk_test' },
    })
      .get('/v1/customers')
      .reply(200, { data: [] });

    const resp = await client.get('/v1/customers');
    expect(resp.status).toBe(200);
  });

  test('defaultHeaders cannot override Authorization', async () => {
    const client = createApiClient({
      apiKey: 'sk_real',
      defaultHeaders: { Authorization: 'Bearer attacker' },
    });

    nock(baseUrl, {
      reqheaders: { authorization: 'Bearer sk_real' },
    })
      .get('/v1/customers')
      .reply(200, { data: [] });

    await client.get('/v1/customers');
  });

  test('caller-supplied per-request header beats defaultHeaders', async () => {
    const client = createApiClient({
      apiKey: 'sk_test',
      defaultHeaders: { 'X-Trace-Id': 'default' },
    });

    nock(baseUrl, {
      reqheaders: { 'x-trace-id': 'override' },
    })
      .get('/v1/customers')
      .reply(200, { data: [] });

    await client.get('/v1/customers', { headers: { 'X-Trace-Id': 'override' } });
  });

  test('null/undefined default values are skipped', async () => {
    const client = createApiClient({
      apiKey: 'sk_test',
      defaultHeaders: { ip_address: undefined as unknown as string },
    });

    nock(baseUrl)
      .matchHeader('ip_address', (val: string | undefined) => val === undefined)
      .get('/v1/customers')
      .reply(200, { data: [] });

    await client.get('/v1/customers');
  });
});

describe('baseURL override', () => {
  test('defaults to the production base URL when none is supplied', async () => {
    const client = createApiClient({ apiKey: 'sk_test' });

    nock('https://api.framepayments.com').get('/v1/customers').reply(200, { data: [] });

    const resp = await client.get('/v1/customers');
    expect(resp.status).toBe(200);
  });

  test('routes requests to a custom baseURL when supplied', async () => {
    const customBase = 'http://api.framepayments.test';
    const client = createApiClient({ apiKey: 'sk_test', baseURL: customBase });

    nock(customBase, {
      reqheaders: { authorization: 'Bearer sk_test' },
    })
      .get('/v1/customers')
      .reply(200, { data: [] });

    const resp = await client.get('/v1/customers');
    expect(resp.status).toBe(200);
  });

  test('FrameSDK forwards baseURL to the underlying client', async () => {
    const customBase = 'http://api.framepayments.test';
    const frame = new FrameSDK({ apiKey: 'sk_test', baseURL: customBase });

    nock(customBase).get('/v1/customers/cust_123').reply(200, { id: 'cust_123' });

    const customer = await frame.customers.get('cust_123');
    expect(customer.id).toBe('cust_123');
  });
});

describe('bearer auth precedence — authToken > session > pk/sk', () => {
  test('per-request authToken (client_secret) wins over pk/sk and is sent verbatim', async () => {
    const client = createApiClient({ apiKey: 'sk_test', publishableKey: 'pk_test' });

    nock(baseUrl, {
      reqheaders: { authorization: 'Bearer ci_123_secret_abc' },
    })
      .post('/v1/charge_intents/ci_123/confirm')
      .reply(200, { id: 'ci_123' });

    await client.post('/v1/charge_intents/ci_123/confirm', undefined, maybePublishableKey({ authToken: 'ci_123_secret_abc' }));
  });

  test('per-request authToken wins over an active onboarding session token', async () => {
    const store = createOnboardingSessionStore();
    store.token = 'onb_sess_live';
    const client = createApiClient({ apiKey: 'sk_test', publishableKey: 'pk_test' }, store);

    nock(baseUrl, {
      reqheaders: { authorization: 'Bearer ci_123_secret_abc' },
    })
      .post('/v1/charge_intents/ci_123/confirm')
      .reply(200, { id: 'ci_123' });

    await client.post('/v1/charge_intents/ci_123/confirm', undefined, maybePublishableKey({ authToken: 'ci_123_secret_abc' }));
  });

  test('active onboarding session token wins over pk/sk for all calls, ignoring usePublishableKey', async () => {
    const store = createOnboardingSessionStore();
    store.token = 'onb_sess_live';
    const client = createApiClient({ apiKey: 'sk_test', publishableKey: 'pk_test' }, store);

    // Default routing (would be sk) -> session token.
    nock(baseUrl, { reqheaders: { authorization: 'Bearer onb_sess_live' } })
      .get('/v1/customers')
      .reply(200, { data: [] });
    // usePublishableKey routing (would be pk) -> still session token.
    nock(baseUrl, { reqheaders: { authorization: 'Bearer onb_sess_live' } })
      .get('/v1/config/evervault')
      .reply(200, {});

    await client.get('/v1/customers');
    await client.get('/v1/config/evervault', withPublishableKey());
  });

  test('falls back to pk/sk when no session token and no authToken', async () => {
    const store = createOnboardingSessionStore();
    const client = createApiClient({ apiKey: 'sk_test', publishableKey: 'pk_test' }, store);

    nock(baseUrl, { reqheaders: { authorization: 'Bearer sk_test' } })
      .get('/v1/customers')
      .reply(200, { data: [] });

    await client.get('/v1/customers');
  });

  test('session token is sent even on a publishable-key-only client', async () => {
    const store = createOnboardingSessionStore();
    store.token = 'onb_sess_live';
    const client = createApiClient({ publishableKey: 'pk_only' }, store);

    nock(baseUrl, { reqheaders: { authorization: 'Bearer onb_sess_live' } })
      .get('/v1/customers')
      .reply(200, { data: [] });

    // No api key configured, but the session token covers the request.
    await client.get('/v1/customers');
  });

  test('the X-Frame-Auth-Token smuggle header is stripped before the request is sent', async () => {
    const client = createApiClient({ apiKey: 'sk_test' });

    nock(baseUrl)
      .matchHeader('X-Frame-Auth-Token', (val: string | undefined) => val === undefined)
      .post('/v1/charge_intents/ci_1/confirm')
      .reply(200, {});

    await client.post('/v1/charge_intents/ci_1/confirm', undefined, maybePublishableKey({ authToken: 'ci_1_secret_x' }));
  });

  test('clearing the session store mid-life reverts to pk/sk', async () => {
    const store = createOnboardingSessionStore();
    store.token = 'onb_sess_live';
    const client = createApiClient({ apiKey: 'sk_test', publishableKey: 'pk_test' }, store);

    nock(baseUrl, { reqheaders: { authorization: 'Bearer onb_sess_live' } })
      .get('/v1/customers')
      .reply(200, { data: [] });
    await client.get('/v1/customers');

    store.token = null;
    nock(baseUrl, { reqheaders: { authorization: 'Bearer sk_test' } })
      .get('/v1/customers')
      .reply(200, { data: [] });
    await client.get('/v1/customers');
  });
});

describe('authToken smuggle does not leak on error.raw', () => {
  test('network-layer FrameAPIError.raw does NOT leak the per-request authToken', async () => {
    const client = createApiClient({ apiKey: 'sk_test', publishableKey: 'pk_test' });

    nock.disableNetConnect();
    try {
      await client.post('/v1/charge_intents/ci_1/confirm', undefined, maybePublishableKey({ authToken: 'ci_1_secret_LEAK' }));
      fail('expected request to reject');
    } catch (err) {
      const raw = JSON.stringify((err as FrameAPIError).raw);
      expect(raw).not.toContain('ci_1_secret_LEAK');
      expect(raw).not.toContain('X-Frame-Auth-Token');
      expect(raw).not.toContain('Bearer');
    } finally {
      nock.enableNetConnect();
    }
  });
});

describe('callers cannot bypass key routing', () => {
  test('manually-set Authorization header is overwritten by the interceptor', async () => {
    const client = createApiClient({ apiKey: 'sk_real', publishableKey: 'pk_real' });

    nock(baseUrl, {
      reqheaders: { authorization: 'Bearer sk_real' },
    })
      .get('/v1/customers')
      .reply(200, { data: [] });

    await client.get('/v1/customers', { headers: { Authorization: 'Bearer attacker_token' } });
  });
});
