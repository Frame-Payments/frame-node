import { createApiClient, createOnboardingSessionStore, type ClientConfig, type OnboardingSessionStore } from './client';
import { AccountsAPI } from './api/accounts-api';
import { BeneficialOwnersAPI } from './api/beneficial_owners-api';
import { CapabilitiesAPI } from './api/capabilities-api';
import { OnboardingSessionsAPI } from './api/onboarding_sessions-api';
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
import { ChargesAPI } from './api/charges-api';
import { ChargeSessionsAPI } from './api/charge_sessions-api';
import { SonarSessionsAPI } from './api/sonar_sessions-api';
import { PhoneVerificationsAPI } from './api/phone_verifications-api';
import { GeofencesAPI } from './api/geofences-api';
import { WebhookEndpointsAPI } from './api/webhook_endpoints-api';
import { PayoutsAPI } from './api/payouts-api';
import { TransfersAPI } from './api/transfers-api';
import { TransferFeePlansAPI } from './api/transfer_fee_plans-api';
import { TransferBillingAgreementsAPI } from './api/transfer_billing_agreements-api';
import { CouponsAPI } from './api/coupons-api';
import { PromotionCodesAPI } from './api/promotion_codes-api';
import { DiscountsAPI } from './api/discounts-api';
import { PaymentLinkSessionsAPI } from './api/payment_link_sessions-api';
import { SubscriptionChangeLogsAPI } from './api/subscription_change_logs-api';
import { BillingAPI } from './api/billing-api';
import { ThreeDsIntentsAPI } from './api/three_ds-api';
import { MerchantBalanceAPI } from './api/merchant_balance-api';
import { ProductPhasesAPI } from './api/product_phases-api';
import { TermsOfServiceAPI } from './api/terms_of_service-api';
import { OnboardingAPI } from './api/onboarding-api';
import { ConfigurationAPI } from './api/configuration-api';
import { DeviceAttestationAPI } from './api/device_attestation-api';
import { WalletAPI } from './api/wallet-api';
import { GeoComplianceAPI } from './api/geo_compliance-api';

export { paginate } from './utils/paginator';
export { FrameAPIError } from './errors/frame_api_error';
export { withPublishableKey, maybePublishableKey } from './client';
export type { ClientConfig, RequestOptions, OnboardingSessionStore } from './client';

export type {
  EvervaultConfiguration,
  SiftConfiguration,
} from './types/configuration';
export type {
  ChallengeResponse,
  AttestRequest,
  AttestResponse,
} from './types/device_attestation';
export type { GooglePayConfiguration } from './types/wallet';
export type {
  ApplePayPaymentDataHeader,
  ApplePayPaymentData,
  ApplePayPaymentMethodInfo,
  ApplePayToken,
  ApplePayBillingContact,
  ApplePayTokenDetails,
  ApplePayDetails,
  ApplePayWalletEnvelope,
  CreateApplePayPaymentMethodParams,
  GooglePayPaymentMethodData,
  GooglePayWalletData,
  GooglePayWalletEnvelope,
  CreateGooglePayPaymentMethodParams,
} from './types/payment_methods';
export type {
  IdentityDocumentUpload,
  ReactNativeFileDescriptor,
  NodeFilePayload,
} from './types/customer_identity';
export type { GeoComplianceStatus } from './types/geo_compliance';
export type {
  BeneficialOwner,
  BeneficialOwnerListResponse,
  CreateBeneficialOwnerParams,
  UpdateBeneficialOwnerParams,
} from './types/beneficial_owners';

export class FrameSDK {
  public accounts: AccountsAPI;
  public beneficialOwners: BeneficialOwnersAPI;
  public capabilities: CapabilitiesAPI;
  public onboardingSessions: OnboardingSessionsAPI;
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
  public charges: ChargesAPI;
  public chargeSessions: ChargeSessionsAPI;
  public sonarSessions: SonarSessionsAPI;
  public phoneVerifications: PhoneVerificationsAPI;
  public geofences: GeofencesAPI;
  public webhookEndpoints: WebhookEndpointsAPI;
  public payouts: PayoutsAPI;
  public transfers: TransfersAPI;
  public transferFeePlans: TransferFeePlansAPI;
  public transferBillingAgreements: TransferBillingAgreementsAPI;
  public coupons: CouponsAPI;
  public promotionCodes: PromotionCodesAPI;
  public discounts: DiscountsAPI;
  public paymentLinkSessions: PaymentLinkSessionsAPI;
  public subscriptionChangeLogs: SubscriptionChangeLogsAPI;
  public billing: BillingAPI;
  public threeDsIntents: ThreeDsIntentsAPI;
  /** @deprecated Use `threeDsIntents` (canonical). Removed at v2. */
  public threeDS: ThreeDsIntentsAPI;
  public merchantBalance: MerchantBalanceAPI;
  public productPhases: ProductPhasesAPI;
  public termsOfService: TermsOfServiceAPI;
  public onboarding: OnboardingAPI;
  public configuration: ConfigurationAPI;
  public deviceAttestation: DeviceAttestationAPI;
  public wallet: WalletAPI;
  public geoCompliance: GeoComplianceAPI;

  // Backs the active onboarding-session bearer token. Mutated in place by
  // setOnboardingSession / clearOnboardingSession so every wired API class keeps
  // sending the same auth without rebuilding the client.
  private onboardingSessionStore: OnboardingSessionStore;

  constructor(config: ClientConfig) {
    this.onboardingSessionStore = createOnboardingSessionStore();
    const client = createApiClient(config, this.onboardingSessionStore);
    this.accounts = new AccountsAPI(client);
    this.beneficialOwners = new BeneficialOwnersAPI(client);
    this.capabilities = new CapabilitiesAPI(client);
    this.onboardingSessions = new OnboardingSessionsAPI(client);
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
    this.charges = new ChargesAPI(client);
    this.chargeSessions = new ChargeSessionsAPI(client);
    this.sonarSessions = new SonarSessionsAPI(client);
    this.phoneVerifications = new PhoneVerificationsAPI(client);
    this.geofences = new GeofencesAPI(client);
    this.webhookEndpoints = new WebhookEndpointsAPI(client);
    this.payouts = new PayoutsAPI(client);
    this.transfers = new TransfersAPI(client);
    this.transferFeePlans = new TransferFeePlansAPI(client);
    this.transferBillingAgreements = new TransferBillingAgreementsAPI(client);
    this.coupons = new CouponsAPI(client);
    this.promotionCodes = new PromotionCodesAPI(client);
    this.discounts = new DiscountsAPI(client);
    this.paymentLinkSessions = new PaymentLinkSessionsAPI(client);
    this.subscriptionChangeLogs = new SubscriptionChangeLogsAPI(client);
    this.billing = new BillingAPI(client);
    this.threeDsIntents = new ThreeDsIntentsAPI(client);
    // Deprecated alias — same instance, so both properties share state.
    this.threeDS = this.threeDsIntents;
    this.merchantBalance = new MerchantBalanceAPI(client);
    this.productPhases = new ProductPhasesAPI(client);
    this.termsOfService = new TermsOfServiceAPI(client);
    this.onboarding = new OnboardingAPI(client);
    this.configuration = new ConfigurationAPI(client);
    this.deviceAttestation = new DeviceAttestationAPI(client);
    this.wallet = new WalletAPI(client);
    this.geoCompliance = new GeoComplianceAPI(client);
  }

  /**
   * Begin an onboarding session. While a session is active, every request sends
   * `Authorization: Bearer <token>` (e.g. an `onb_sess_...` token), overriding
   * the configured publishable/secret keys regardless of `usePublishableKey`.
   * A per-request `authToken` (object client_secret) still takes precedence.
   *
   * Mirrors the native iOS `beginOnboardingSession`.
   */
  setOnboardingSession(token: string): void {
    this.onboardingSessionStore.token = token;
  }

  /**
   * End the active onboarding session, reverting auth to the configured
   * publishable/secret keys.
   *
   * Safe-clear: when `token` is provided, the session is cleared only if it
   * matches the currently active token. This mirrors Android's guarded
   * teardown so a stale unmount cannot wipe a newer session. Omit `token` to
   * force-clear unconditionally.
   *
   * @returns true if a session was cleared, false if the guard prevented it.
   */
  clearOnboardingSession(token?: string): boolean {
    if (token !== undefined && this.onboardingSessionStore.token !== token) {
      return false;
    }
    this.onboardingSessionStore.token = null;
    return true;
  }
}
