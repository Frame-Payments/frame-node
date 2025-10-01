import type { Charge, ChargeIntent } from './charge_intents';
import type { CustomerIdentityVerification } from './customer_identity';
import type { Customer } from './customers';
import type { InvoiceLineItem } from './invoice_line_items';
import type { Invoice } from './invoices';
import type { PaymentLink } from './payment_links';
import type { PaymentMethod } from './payment_methods';
import type { Product } from './products';
import type { Refund } from './refunds';
import type { Subscription } from './subscriptions';

export enum EventType {
  // Charges
  CHARGE_CAPTURED = 'charge.captured',
  CHARGE_EXPIRED = 'charge.expired',
  CHARGE_PENDING = 'charge.pending',
  CHARGE_REFUNDED = 'charge.refunded',

  // Customers
  CUSTOMER_CREATED = 'customer.created',
  CUSTOMER_DELETED = 'customer.deleted',
  CUSTOMER_UPDATED = 'customer.updated',

  // Subscriptions
  SUBSCRIPTION_CREATED = 'customer.subscription.created',
  SUBSCRIPTION_UPDATED = 'customer.subscription.updated',
  SUBSCRIPTION_INCOMPLETE = 'customer.subscription.incomplete',

  // Customer Identity Verifications
  CUSTOMER_IDENTITY_VERIFICATION_CREATED = 'customer.identity_verification.created',
  CUSTOMER_IDENTITY_VERIFICATION_UPDATED = 'customer.identity_verification.updated',

  // Charge Intents
  CHARGE_INTENT_CANCELED = 'charge_intent.canceled',
  CHARGE_INTENT_CREATED = 'charge_intent.created',
  CHARGE_INTENT_PAYMENT_FAILED = 'charge_intent.payment_failed',
  CHARGE_INTENT_REQUIRES_ACTION = 'charge_intent.requires_action',
  CHARGE_INTENT_PAYMENT_ACTION_REQUIRED = 'charge_intent.payment_action_required',
  CHARGE_INTENT_SUCCEEDED = 'charge_intent.succeeded',

  // Invoices
  INVOICE_CREATED = 'invoice.created',
  INVOICE_DELETED = 'invoice.deleted',
  INVOICE_OVERDUE = 'invoice.overdue',
  INVOICE_PAID = 'invoice.paid',
  INVOICE_ISSUED = 'invoice.issued',
  INVOICE_UPDATED = 'invoice.updated',
  INVOICE_VOIDED = 'invoice.voided',
  INVOICE_LINE_ITEM_CREATED = 'invoice.line_item.created',
  INVOICE_LINE_ITEM_UPDATED = 'invoice.line_item.updated',
  INVOICE_LINE_ITEM_DELETED = 'invoice.line_item.deleted',

  // Payment Links
  PAYMENT_LINK_CREATED = 'payment_link.created',

  // Payment Methods
  PAYMENT_METHOD_DETACHED = 'payment_method.detached',
  PAYMENT_METHOD_UPDATED = 'payment_method.updated',

  // Products
  PRODUCT_CREATED = 'product.created',
  PRODUCT_UPDATED = 'product.updated',
  PRODUCT_DELETED = 'product.deleted',

  // Refunds
  REFUND_CREATED = 'refund.created',
  REFUND_FAILED = 'refund.failed',
}

// The general payload for all events
interface EventPayload<T extends EventType, D extends unknown> {
  id: string;
  type: T;
  object: string;
  created: number;
  livemode: boolean;
  data: D;
}

// Charges
export interface ChargeCapturedEvent
  extends EventPayload<EventType.CHARGE_CAPTURED, Charge> {}
export interface ChargeExpiredEvent
  extends EventPayload<EventType.CHARGE_EXPIRED, Charge> {}
export interface ChargePendingEvent
  extends EventPayload<EventType.CHARGE_PENDING, Charge> {}
export interface ChargeRefundedEvent
  extends EventPayload<EventType.CHARGE_REFUNDED, Charge> {}

// Customers
export interface CustomerCreatedEvent
  extends EventPayload<EventType.CUSTOMER_CREATED, Customer> {}
export interface CustomerDeletedEvent
  extends EventPayload<EventType.CUSTOMER_DELETED, Customer> {}
export interface CustomerUpdatedEvent
  extends EventPayload<EventType.CUSTOMER_UPDATED, Customer> {}

// Subscriptions
export interface SubscriptionCreatedEvent
  extends EventPayload<EventType.SUBSCRIPTION_CREATED, Subscription> {}
export interface SubscriptionUpdatedEvent
  extends EventPayload<EventType.SUBSCRIPTION_UPDATED, Subscription> {}
export interface SubscriptionIncompleteEvent
  extends EventPayload<EventType.SUBSCRIPTION_INCOMPLETE, Subscription> {}

// Customer Identity Verifications
export interface CustomerIdentityVerificationCreatedEvent
  extends EventPayload<
    EventType.CUSTOMER_IDENTITY_VERIFICATION_CREATED,
    CustomerIdentityVerification
  > {}
export interface CustomerIdentityVerificationUpdatedEvent
  extends EventPayload<
    EventType.CUSTOMER_IDENTITY_VERIFICATION_UPDATED,
    CustomerIdentityVerification
  > {}

// Charge Intents
export interface ChargeIntentCanceledEvent
  extends EventPayload<EventType.CHARGE_INTENT_CANCELED, ChargeIntent> {}
export interface ChargeIntentCreatedEvent
  extends EventPayload<EventType.CHARGE_INTENT_CREATED, ChargeIntent> {}
export interface ChargeIntentPaymentFailedEvent
  extends EventPayload<EventType.CHARGE_INTENT_PAYMENT_FAILED, ChargeIntent> {}
export interface ChargeIntentRequiresActionEvent
  extends EventPayload<EventType.CHARGE_INTENT_REQUIRES_ACTION, ChargeIntent> {}
export interface ChargeIntentPaymentActionRequiredEvent
  extends EventPayload<
    EventType.CHARGE_INTENT_PAYMENT_ACTION_REQUIRED,
    ChargeIntent
  > {}
export interface ChargeIntentSucceededEvent
  extends EventPayload<EventType.CHARGE_INTENT_SUCCEEDED, ChargeIntent> {}

// Invoices
export interface InvoiceCreatedEvent
  extends EventPayload<EventType.INVOICE_CREATED, Invoice> {}
export interface InvoiceDeletedEvent
  extends EventPayload<EventType.INVOICE_DELETED, Invoice> {}
export interface InvoiceOverdueEvent
  extends EventPayload<EventType.INVOICE_OVERDUE, Invoice> {}
export interface InvoicePaidEvent
  extends EventPayload<EventType.INVOICE_PAID, Invoice> {}
export interface InvoiceIssuedEvent
  extends EventPayload<EventType.INVOICE_ISSUED, Invoice> {}
export interface InvoiceUpdatedEvent
  extends EventPayload<EventType.INVOICE_UPDATED, Invoice> {}
export interface InvoiceVoidedEvent
  extends EventPayload<EventType.INVOICE_VOIDED, Invoice> {}
export interface InvoiceLineItemCreatedEvent
  extends EventPayload<EventType.INVOICE_LINE_ITEM_CREATED, InvoiceLineItem> {}
export interface InvoiceLineItemUpdatedEvent
  extends EventPayload<EventType.INVOICE_LINE_ITEM_UPDATED, InvoiceLineItem> {}
export interface InvoiceLineItemDeletedEvent
  extends EventPayload<EventType.INVOICE_LINE_ITEM_DELETED, InvoiceLineItem> {}

// Payment Links
export interface PaymentLinkCreatedEvent
  extends EventPayload<EventType.PAYMENT_LINK_CREATED, PaymentLink> {}

// Payment Methods
export interface PaymentMethodDetachedEvent
  extends EventPayload<EventType.PAYMENT_METHOD_DETACHED, PaymentMethod> {}
export interface PaymentMethodUpdatedEvent
  extends EventPayload<EventType.PAYMENT_METHOD_UPDATED, PaymentMethod> {}

// Products
export interface ProductCreatedEvent
  extends EventPayload<EventType.PRODUCT_CREATED, Product> {}
export interface ProductUpdatedEvent
  extends EventPayload<EventType.PRODUCT_UPDATED, Product> {}
export interface ProductDeletedEvent
  extends EventPayload<EventType.PRODUCT_DELETED, Product> {}

// Refunds
export interface RefundCreatedEvent
  extends EventPayload<EventType.REFUND_CREATED, Refund> {}
export interface RefundFailedEvent
  extends EventPayload<EventType.REFUND_FAILED, Refund> {}
