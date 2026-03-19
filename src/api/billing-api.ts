import type { AxiosInstance } from 'axios';
import type {
  Metering,
  CreateMeteringParams,
  UpdateMeteringParams,
  MeteringEvent,
  CreateMeteringEventParams,
  UpdateMeteringEventParams,
  BillingInvoice,
  CreateBillingInvoiceParams,
  BillingCredit,
  CreateBillingCreditParams,
  BillingReport
} from '../types/billing';

export class BillingAPI {
  constructor(private client: AxiosInstance) {}

  async createMetering(params: CreateMeteringParams): Promise<Metering> {
    const resp = await this.client.post('/v1/billing/metering', params);
    return resp.data;
  }

  async getMetering(id: string): Promise<Metering> {
    const resp = await this.client.get(`/v1/billing/metering/${id}`);
    return resp.data;
  }

  async updateMetering(id: string, params: UpdateMeteringParams): Promise<Metering> {
    const resp = await this.client.patch(`/v1/billing/metering/${id}`, params);
    return resp.data;
  }

  async createMeteringEvent(params: CreateMeteringEventParams): Promise<MeteringEvent> {
    const resp = await this.client.post('/v1/billing/metering_events', params);
    return resp.data;
  }

  async getMeteringEvent(id: string): Promise<MeteringEvent> {
    const resp = await this.client.get(`/v1/billing/metering_events/${id}`);
    return resp.data;
  }

  async updateMeteringEvent(id: string, params: UpdateMeteringEventParams): Promise<MeteringEvent> {
    const resp = await this.client.patch(`/v1/billing/metering_events/${id}`, params);
    return resp.data;
  }

  async createBillingInvoice(params: CreateBillingInvoiceParams): Promise<BillingInvoice> {
    const resp = await this.client.post('/v1/billing/billing_invoice', params);
    return resp.data;
  }

  async createBillingCredit(params: CreateBillingCreditParams): Promise<BillingCredit> {
    const resp = await this.client.post('/v1/billing/billing_credit', params);
    return resp.data;
  }

  async getBillingCredit(id: string): Promise<BillingCredit> {
    const resp = await this.client.get(`/v1/billing/billing_credit/${id}`);
    return resp.data;
  }

  async getCustomerReport(params?: Record<string, unknown>): Promise<BillingReport> {
    const resp = await this.client.get('/v1/billing/report/customer', { params });
    return resp.data;
  }

  async getEventReport(eventName: string, params?: Record<string, unknown>): Promise<BillingReport> {
    const resp = await this.client.get(`/v1/billing/report/event/${eventName}`, { params });
    return resp.data;
  }

  async getEventsReport(params?: Record<string, unknown>): Promise<BillingReport> {
    const resp = await this.client.get('/v1/billing/report/events', { params });
    return resp.data;
  }

  async getSubscriptionReport(params?: Record<string, unknown>): Promise<BillingReport> {
    const resp = await this.client.get('/v1/billing/report/subscription', { params });
    return resp.data;
  }
}
