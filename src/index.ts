import { createApiClient, type ClientConfig } from './client';
import { CustomersAPI } from './api/customers-api';
import { PaymentMethodsAPI } from './api/payment_methods-api';
import { ChargeIntentsAPI } from './api/charge_intents-api';
import { RefundsAPI } from './api/refunds-api';
import { SubscriptionsAPI } from './api/subscriptions-api';
import { CustomerIdentityVerificationsAPI } from './api/customer_identity-api';
import { SubscriptionPhasesAPI } from './api/subscription_phases-api';

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

  constructor(config: ClientConfig) {
    const client = createApiClient(config);
    this.customers = new CustomersAPI(client);
    this.paymentMethods = new PaymentMethodsAPI(client);
    this.chargeIntents = new ChargeIntentsAPI(client);
    this.refunds = new RefundsAPI(client);
    this.subscriptions = new SubscriptionsAPI(client);
    this.customerIdentityVerifications = new CustomerIdentityVerificationsAPI(client);
    this.subscriptionPhases = new SubscriptionPhasesAPI(client)
  }
}