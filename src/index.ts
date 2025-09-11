import { createApiClient, type ClientConfig } from './client';
import { CustomersAPI } from './api/customers-api';
import { PaymentMethodsAPI } from './api/payment_methods-api';
import { ChargeIntentsAPI } from './api/charge_intents-api';
import { RefundsAPI } from './api/refunds-api';
import { SubscriptionsAPI } from './api/subscriptions-api';
import { CustomerIdentityVerificationsAPI } from './api/customer_identity-api';
import { SubscriptionPhasesAPI } from './api/subscription_phases-api';
import { InvoicesAPI } from './api/invoices-api';
import { InvoiceLineItemsAPI } from './api/invoice_line_item-api';
import { DisputesAPI } from './api/disputes-api';
import { ProductsAPI } from './api/products-api';
import type { AxiosInstance } from 'axios';

export { paginate } from './utils/paginator'
export { FrameAPIError } from './errors/frame_api_error'

export class FrameSDK {
  public customers: CustomersAPI;
  public paymentMethods: PaymentMethodsAPI;
  public chargeIntents: ChargeIntentsAPI;
  public refunds: RefundsAPI;
  public subscriptions: SubscriptionsAPI;
  public customerIdentityVerifications: CustomerIdentityVerificationsAPI;
  public subscriptionPhases: SubscriptionPhasesAPI;
  public invoices: InvoicesAPI;
  public invoiceLineItems: InvoiceLineItemsAPI;
  public disputes: DisputesAPI;
  public products: ProductsAPI;

   constructor(config: ClientConfig) {
    const client = createApiClient(config);
    this.customers = new CustomersAPI(client);
    this.paymentMethods = new PaymentMethodsAPI(client);
    this.chargeIntents = new ChargeIntentsAPI(client);
    this.refunds = new RefundsAPI(client);
    this.subscriptions = new SubscriptionsAPI(client);
    this.customerIdentityVerifications = new CustomerIdentityVerificationsAPI(client);
    this.subscriptionPhases = new SubscriptionPhasesAPI(client);
    this.invoices = new InvoicesAPI(client);
    this.invoiceLineItems = new InvoiceLineItemsAPI(client);
    this.disputes = new DisputesAPI(client);
    this.products = new ProductsAPI(client);
  }
//   static async init(config: ClientConfig): Promise<FrameSDK> {
//     const client = await initClient(config);
//     return new FrameSDK(client);
//   }
}