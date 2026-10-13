import { randomUUID } from 'crypto';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type {
  UpdateWalletParams,
  Wallet,
  WalletListParams,
  WalletListResponse,
} from '../types/wallets';
import { maybePublishableKey, type RequestOptions } from '../client';

export type WalletIdempotentOptions = RequestOptions & AxiosRequestConfig & {
  /** Opaque idempotency key (1–255 chars). A UUID is generated when omitted. */
  idempotencyKey?: string;
};

function withIdempotencyKey(
  opts?: WalletIdempotentOptions,
): { key: string; rest: RequestOptions & AxiosRequestConfig } {
  const { idempotencyKey, ...rest } = opts ?? {};
  return { key: idempotencyKey?.trim() || randomUUID(), rest };
}

export class WalletsAPI {
  constructor(private client: AxiosInstance) {}

  async list(params: WalletListParams = {}): Promise<WalletListResponse> {
    const resp = await this.client.get('/v2/wallets', { params });
    return resp.data;
  }

  async retrieve(id: string, opts?: RequestOptions): Promise<Wallet> {
    const resp = await this.client.get(`/v2/wallets/${id}`, maybePublishableKey(opts));
    return resp.data;
  }

  async retrieve_default(
    params: { account_id?: string } = {},
    opts?: RequestOptions,
  ): Promise<Wallet> {
    const resp = await this.client.get('/v2/wallets/default', {
      ...maybePublishableKey(opts),
      params,
    });
    return resp.data;
  }

  async update(
    id: string,
    params: UpdateWalletParams,
    opts?: WalletIdempotentOptions,
  ): Promise<Wallet> {
    const { key, rest } = withIdempotencyKey(opts);
    const base = maybePublishableKey(rest);
    const resp = await this.client.patch(`/v2/wallets/${id}`, params, {
      ...base,
      headers: {
        ...((base.headers as Record<string, string> | undefined) ?? {}),
        'Idempotency-Key': key,
      },
    });
    return resp.data;
  }
}
