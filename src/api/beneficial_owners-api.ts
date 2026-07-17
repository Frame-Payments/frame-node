import type { AxiosInstance } from 'axios';
import type { Account } from '../types/accounts';
import type {
  BeneficialOwner,
  BeneficialOwnerListResponse,
  CreateBeneficialOwnerParams,
  UpdateBeneficialOwnerParams,
} from '../types/beneficial_owners';
import { maybePublishableKey, type RequestOptions } from '../client';

export class BeneficialOwnersAPI {
  constructor(private client: AxiosInstance) {}

  async list(accountId: string, opts?: RequestOptions): Promise<BeneficialOwnerListResponse> {
    const resp = await this.client.get(
      `/v1/accounts/${accountId}/beneficial_owners`,
      maybePublishableKey(opts),
    );
    return resp.data;
  }

  async create(
    accountId: string,
    params: CreateBeneficialOwnerParams,
    opts?: RequestOptions,
  ): Promise<BeneficialOwner> {
    const resp = await this.client.post(
      `/v1/accounts/${accountId}/beneficial_owners`,
      params,
      maybePublishableKey(opts),
    );
    return resp.data;
  }

  async retrieve(accountId: string, id: string, opts?: RequestOptions): Promise<BeneficialOwner> {
    const resp = await this.client.get(
      `/v1/accounts/${accountId}/beneficial_owners/${id}`,
      maybePublishableKey(opts),
    );
    return resp.data;
  }

  async update(
    accountId: string,
    id: string,
    params: UpdateBeneficialOwnerParams,
    opts?: RequestOptions,
  ): Promise<BeneficialOwner> {
    const resp = await this.client.patch(
      `/v1/accounts/${accountId}/beneficial_owners/${id}`,
      params,
      maybePublishableKey(opts),
    );
    return resp.data;
  }

  async delete(accountId: string, id: string): Promise<void> {
    await this.client.delete(`/v1/accounts/${accountId}/beneficial_owners/${id}`);
  }

  async confirmRoster(accountId: string, opts?: RequestOptions): Promise<Account> {
    const resp = await this.client.post(
      `/v1/accounts/${accountId}/beneficial_owners/confirm`,
      undefined,
      maybePublishableKey(opts),
    );
    return resp.data;
  }

  async resendInvite(accountId: string, id: string, opts?: RequestOptions): Promise<BeneficialOwner> {
    const resp = await this.client.post(
      `/v1/accounts/${accountId}/beneficial_owners/${id}/resend_invite`,
      undefined,
      maybePublishableKey(opts),
    );
    return resp.data;
  }
}
