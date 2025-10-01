export enum PaymentLinkStatus {
  ACTIVE = 'active',
  // TODO: Add other statuses - not sure what they are
}

export interface PaymentLink {
  id: string;
  name: string;
  status: PaymentLinkStatus;
  created: number;
  link_id: string;
  updated: number;
  livemode: boolean;
  shipping_address_required: boolean;
  require_customer_phone_number: boolean;
  object: string;
}
