import type { AxiosInstance } from 'axios';
import type {
  Account,
  AccountListResponse,
  ListAccountsParams,
  CreateAccountParams,
  UpdateAccountParams,
  SearchAccountsParams,
  PlaidLinkTokenResponse
} from '../types/accounts';
import type { GeoComplianceStatus } from '../types/geo_compliance';
import type { PaymentMethodListResponse } from '../types/payment_methods';
import { paginate } from '../utils/paginator';
import { maybePublishableKey, type RequestOptions } from '../client';

export class AccountsAPI {
  constructor(private client: AxiosInstance) {}

  async list(params?: ListAccountsParams): Promise<AccountListResponse> {
    const resp = await this.client.get('/v1/accounts', { params: params ?? {} });
    return resp.data;
  }

  async create(params: CreateAccountParams, opts?: RequestOptions): Promise<Account> {
    const resp = await this.client.post('/v1/accounts', params, maybePublishableKey(opts));
    return resp.data;
  }

  async retrieve(id: string, opts?: RequestOptions): Promise<Account> {
    const resp = await this.client.get(`/v1/accounts/${id}`, maybePublishableKey(opts));
    return resp.data;
  }

  /** @deprecated Use `retrieve` instead. Removed at v2. */
  async get(id: string, opts?: RequestOptions): Promise<Account> {
    return this.retrieve(id, opts);
  }

  async update(id: string, params: UpdateAccountParams, opts?: RequestOptions): Promise<Account> {
    const resp = await this.client.patch(`/v1/accounts/${id}`, params, maybePublishableKey(opts));
    return resp.data;
  }

  async disable(id: string): Promise<Account> {
    const resp = await this.client.delete(`/v1/accounts/${id}`);
    return resp.data;
  }

  async search(params: SearchAccountsParams): Promise<AccountListResponse> {
    const resp = await this.client.get('/v1/accounts/search', { params });
    return resp.data;
  }

  // Returns the `{ meta?, data? }` envelope produced by
  // `GET /v1/accounts/{id}/payment_methods`. Matches Frame-iOS
  // `PaymentMethodResponses.ListPaymentMethodsResponse`. Callers that just
  // need the array should read `result.data ?? []`.
  async getPaymentMethods(id: string, opts?: RequestOptions): Promise<PaymentMethodListResponse> {
    const resp = await this.client.get(`/v1/accounts/${id}/payment_methods`, maybePublishableKey(opts));
    return resp.data;
  }

  async restrict(id: string): Promise<Account> {
    const resp = await this.client.post(`/v1/accounts/${id}/restrict`);
    return resp.data;
  }

  async unrestrict(id: string): Promise<Account> {
    const resp = await this.client.post(`/v1/accounts/${id}/unrestrict`);
    return resp.data;
  }

  async getPlaidLinkToken(id: string, opts?: RequestOptions): Promise<PlaidLinkTokenResponse> {
    const resp = await this.client.get(`/v1/accounts/${id}/plaid_link_token`, maybePublishableKey(opts));
    return resp.data;
  }

  async getGeoCompliance(accountId: string, opts?: RequestOptions): Promise<GeoComplianceStatus> {
    const resp = await this.client.get(
      `/v1/accounts/${accountId}/geo_compliance`,
      maybePublishableKey(opts),
    );
    return resp.data;
  }

  // Confirms the KYC prefill data on an account, promoting the prefilled
  // profile to the account's verified identity. Account-scoped op backing the
  // hosted onboarding flow.
  async confirmKycPrefill(id: string, opts?: RequestOptions): Promise<Account> {
    const resp = await this.client.post(
      `/v1/accounts/${id}/kyc_prefill/confirm`,
      undefined,
      maybePublishableKey(opts),
    );
    return resp.data;
  }

  iterateAllAccounts(per_page = 20): AsyncGenerator<Account> {
    return paginate<Account>(async (page: number) => {
      const res = await this.client.get('/v1/accounts', {
        params: { per_page, page }
      });
      return res.data;
    }, per_page);
  }
}
