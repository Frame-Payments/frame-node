/// <reference types="jest" />

import nock from 'nock';
import { createApiClient, withPublishableKey, maybePublishableKey } from '../src/client';
import { FrameAPIError } from '../src/errors/frame_api_error';

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
