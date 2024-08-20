import { isUndefined } from '../utils.js';
import { I18nMessage } from '../i18n/i18n_messages.js';

export const IdentityAssertionStrategy = {
  availableStrategies() {
    return [
      BothPartsUndefined,
      DefaultIdentity,
    ];
  },

  evaluate(actual, expected) {
    return this.availableStrategies()
      .find(strategy => strategy.appliesTo(actual, expected))
      .evaluate(actual, expected);
  },
};

const BothPartsUndefined = {
  __proto__: IdentityAssertionStrategy,

  appliesTo(actual, expected) {
    return isUndefined(actual) && isUndefined(expected);
  },

  evaluate() {
    return {
      comparisonResult: undefined,
      overrideFailureMessage: () => I18nMessage.of('identity_assertion_failed_due_to_undetermination'),
    };
  },
};

const DefaultIdentity = {
  __proto__: IdentityAssertionStrategy,

  appliesTo(_actual, _expected) {
    return true;
  },

  evaluate(actual, expected) {
    return {
      comparisonResult: actual === expected,
    };
  },
};
