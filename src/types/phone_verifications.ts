export interface PhoneVerification {
  id: string;
  object: string;
  status: string;
  phone_number: string;
  account_id: string;
  created: number;
  updated: number;
  livemode: boolean;
}

export interface CreatePhoneVerificationParams {
  phone_number: string;
  type?: string;
}

export interface ConfirmPhoneVerificationParams {
  code: string;
}
