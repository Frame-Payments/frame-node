/// <reference types="jest" />

// Guard test for FRA-4713: the payment-method public types/enums must remain
// importable from the package entry point. The 2.4.0 bundle dropped them from
// the deep-import path, forcing consumers (frame-react-native) to mirror them
// locally. These imports failing to resolve is the regression we're guarding.
import {
  PaymentMethodType,
  PaymentAccountType,
  PaymentMethodStatus,
} from '../src/index';
import type {
  PaymentMethod,
  PaymentCard,
  BankAccount,
  PaymentMethodListResponse,
  Address,
} from '../src/index';

describe('entry-point payment-method exports', () => {
  it('re-exports the enums as runtime values with the expected members', () => {
    expect(PaymentMethodType.CARD).toBe('card');
    expect(PaymentMethodType.ACH).toBe('ach');
    expect(PaymentAccountType.CHECKING).toBe('checking');
    expect(PaymentAccountType.SAVINGS).toBe('savings');
    expect(PaymentMethodStatus.ACTIVE).toBe('active');
    expect(PaymentMethodStatus.BLOCKED).toBe('blocked');
    expect(PaymentMethodStatus.DETACHED).toBe('detached');
  });

  it('re-exports the public types (compile-time assertion)', () => {
    // If any of these types were not exported from the entry point, this file
    // would fail to typecheck. The runtime body just anchors the assertion.
    const card: PaymentCard = {
      brand: 'visa',
      exp_month: '01',
      exp_year: '2030',
      last_four: '4242',
    };
    const bank: BankAccount = { account_type: PaymentAccountType.CHECKING };
    const billing: Address = {} as Address;
    const method: PaymentMethod = {
      id: 'pm_test',
      type: PaymentMethodType.CARD,
      livemode: false,
      created: 0,
      status: PaymentMethodStatus.ACTIVE,
      card,
      ach: bank,
      billing,
    };
    const list: PaymentMethodListResponse = { data: [method] };

    expect(list.data?.[0].id).toBe('pm_test');
  });
});
