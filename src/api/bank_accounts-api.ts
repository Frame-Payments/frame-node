import type { AxiosInstance } from 'axios';
import type { BankAccount, CreateBankAccountParams } from '../types/bank_accounts';
import { maybePublishableKey, type RequestOptions } from '../client';

export class BankAccountsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: CreateBankAccountParams, opts?: RequestOptions): Promise<BankAccount> {
    const resp = await this.client.post('/v1/bank_accounts', params, maybePublishableKey(opts));
    return resp.data;
  }

  async retrieve(id: string): Promise<BankAccount> {
    const resp = await this.client.get(`/v1/bank_accounts/${id}`);
    return resp.data;
  }
}
