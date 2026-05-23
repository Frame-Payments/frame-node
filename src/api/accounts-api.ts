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
import type { PaymentMethod } from '../types/payment_methods';
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

  async get(id: string, opts?: RequestOptions): Promise<Account> {
    const resp = await this.client.get(`/v1/accounts/${id}`, maybePublishableKey(opts));
    return resp.data;
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

  async getPaymentMethods(id: string, opts?: RequestOptions): Promise<PaymentMethod[]> {
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

  async getGeoCompliance(accountId: string): Promise<GeoComplianceStatus> {
    const resp = await this.client.get(`/v1/accounts/${accountId}/geo_compliance`);
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
