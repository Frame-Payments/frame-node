import { randomUUID } from 'crypto';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type {
  AmountOnlyV2Params,
  CreateTransferV2Params,
  TransferV2,
  TransferV2CreateOptions,
  TransferV2ListResponse,
} from '../types/transfers-v2';
import { paginate } from '../utils/paginator';
import { maybePublishableKey, type RequestOptions } from '../client';

export type { TransferV2CreateOptions };

/** Options that carry an optional `Idempotency-Key` for V2 mutating members. */
export type TransferV2IdempotentOptions = TransferV2CreateOptions & RequestOptions & AxiosRequestConfig;

function withIdempotencyKey(
  opts?: TransferV2IdempotentOptions,
): { key: string; rest: RequestOptions & AxiosRequestConfig } {
  const { idempotencyKey, ...rest } = opts ?? {};
  return { key: idempotencyKey?.trim() || randomUUID(), rest };
}

export class TransfersV2API {
  constructor(private client: AxiosInstance) {}

  async list(per_page?: number, page?: number): Promise<TransferV2ListResponse> {
    const resp = await this.client.get('/v2/transfers', { params: { per_page, page } });
    return resp.data;
  }

  async retrieve(id: string, opts?: RequestOptions): Promise<TransferV2> {
    const resp = await this.client.get(`/v2/transfers/${id}`, maybePublishableKey(opts));
    return resp.data;
  }

  async create(
    params: CreateTransferV2Params,
    opts?: TransferV2IdempotentOptions,
  ): Promise<TransferV2> {
    const { key, rest } = withIdempotencyKey(opts);
    const base = maybePublishableKey(rest);
    const resp = await this.client.post('/v2/transfers', params, {
      ...base,
      headers: {
        ...((base.headers as Record<string, string> | undefined) ?? {}),
        'Idempotency-Key': key,
      },
    });
    return resp.data;
  }

  async update(id: string, params: Partial<CreateTransferV2Params>): Promise<TransferV2> {
    const resp = await this.client.patch(`/v2/transfers/${id}`, params);
    return resp.data;
  }

  /**
   * Confirms a transfer. Secret-key callers should pass `idempotencyKey` (auto-generated
   * when omitted). Publishable + `client_secret` confirms omit the header.
   */
  async confirm(
    id: string,
    params?: Partial<CreateTransferV2Params> | { client_secret: string },
    opts?: TransferV2IdempotentOptions,
  ): Promise<TransferV2> {
    const isClientSecret =
      !!params &&
      typeof params === 'object' &&
      'client_secret' in params &&
      typeof (params as { client_secret?: unknown }).client_secret === 'string';

    if (isClientSecret) {
      const resp = await this.client.post(
        `/v2/transfers/${id}/confirm`,
        params ?? {},
        maybePublishableKey(opts),
      );
      return resp.data;
    }

    const { key, rest } = withIdempotencyKey(opts);
    const base = maybePublishableKey(rest);
    const resp = await this.client.post(`/v2/transfers/${id}/confirm`, params ?? {}, {
      ...base,
      headers: {
        ...((base.headers as Record<string, string> | undefined) ?? {}),
        'Idempotency-Key': key,
      },
    });
    return resp.data;
  }

  async capture(
    id: string,
    params?: AmountOnlyV2Params,
    opts?: TransferV2IdempotentOptions,
  ): Promise<TransferV2> {
    const { key, rest } = withIdempotencyKey(opts);
    const resp = await this.client.post(`/v2/transfers/${id}/capture`, params ?? {}, {
      ...rest,
      headers: {
        ...((rest.headers as Record<string, string> | undefined) ?? {}),
        'Idempotency-Key': key,
      },
    });
    return resp.data;
  }

  async void(id: string, opts?: TransferV2IdempotentOptions): Promise<TransferV2> {
    const { key, rest } = withIdempotencyKey(opts);
    const resp = await this.client.post(`/v2/transfers/${id}/void`, {}, {
      ...rest,
      headers: {
        ...((rest.headers as Record<string, string> | undefined) ?? {}),
        'Idempotency-Key': key,
      },
    });
    return resp.data;
  }

  async refund(
    id: string,
    params?: AmountOnlyV2Params,
    opts?: TransferV2IdempotentOptions,
  ): Promise<TransferV2> {
    const { key, rest } = withIdempotencyKey(opts);
    const resp = await this.client.post(`/v2/transfers/${id}/refund`, params ?? {}, {
      ...rest,
      headers: {
        ...((rest.headers as Record<string, string> | undefined) ?? {}),
        'Idempotency-Key': key,
      },
    });
    return resp.data;
  }

  async iterateAllTransfers(per_page = 20) {
    return paginate<TransferV2>(async (page: number) => {
      const res = await this.client.get('/v2/transfers', { params: { per_page, page } });
      return res.data;
    }, per_page);
  }
}
