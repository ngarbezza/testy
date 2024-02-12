'use strict';

import {
  deepStrictEqual,
  isCyclic,
  isFunction,
  isString,
  isUndefined,
  respondsTo,
  subclassResponsibility,
} from '../utils.js';
import { I18nMessage } from '../i18n/i18n_messages.js';

export class EqualityAssertionStrategy {
  static evaluate(actual, expected, criteria) {
    return this.#availableStrategies()
      .find(strategy => strategy.appliesTo(actual, expected, criteria))
      .evaluate(actual, expected, criteria);
  }

  static #availableStrategies() {
    return [
      new BothPartsUndefined(),
      new CustomFunction(),
      new CustomPropertyName(),
      new ObjectWithEqualsProperty(),
      new ObjectWithCyclicReference(),
      new DefaultEquality(),
    ];
  }

  appliesTo(_actual, _expected) {
    return false;
  }

  evaluate(_actual, _expected, _criterie) {
    return subclassResponsibility();
  }
}

class BothPartsUndefined extends EqualityAssertionStrategy {
  appliesTo(actual, expected) {
    return isUndefined(actual) && isUndefined(expected);
  }

  evaluate(_actual, _expected, _criterie) {
    return {
      comparisonResult: undefined,
      overrideFailureMessage: () => I18nMessage.of('equality_assertion_failed_due_to_undetermination'),
    };
  }
}

class CustomFunction extends EqualityAssertionStrategy {
  appliesTo(_actual, _expected, criteria) {
    return isFunction(criteria);
  }

  evaluate(actual, expected, criteria) {
    return {
      comparisonResult: criteria(actual, expected),
      additionalFailureMessage: () => I18nMessage.empty(),
    };
  }
}

class CustomPropertyName extends EqualityAssertionStrategy {
  appliesTo(_actual, _expected, criteria) {
    return isString(criteria);
  }

  evaluate(actual, expected, criteria) {
    if (this.#comparisonCanBeMade(actual, expected, criteria)) {
      return this.#compareUsingCustomCriteria(actual, expected, criteria);
    } else {
      return this.#failWithCriteriaNotFoundMessage(criteria);
    }
  }

  #comparisonCanBeMade(actual, expected, criteria) {
    return respondsTo(actual, criteria) && respondsTo(expected, criteria);
  }

  #compareUsingCustomCriteria(actual, expected, criteria) {
    return {
      comparisonResult: actual[criteria](expected),
      additionalFailureMessage: () => I18nMessage.empty(),
    };
  }

  #failWithCriteriaNotFoundMessage(criteria) {
    return {
      comparisonResult: false,
      additionalFailureMessage: () => I18nMessage.of('equality_assertion_failed_due_to_missing_property', criteria),
    };
  }
}

class ObjectWithEqualsProperty extends EqualityAssertionStrategy {
  appliesTo(actual, _expected) {
    return respondsTo(actual, 'equals');
  }

  evaluate(actual, expected, _criteria) {
    return {
      comparisonResult: actual.equals(expected),
      additionalFailureMessage: () => I18nMessage.empty(),
    };
  }
}

class ObjectWithCyclicReference extends EqualityAssertionStrategy {
  appliesTo(actual, expected) {
    return isCyclic(actual) || isCyclic(expected);
  }

  evaluate(_actual, _expected, _criteria) {
    return {
      comparisonResult: false,
      additionalFailureMessage: () => I18nMessage.of('equality_assertion_failed_due_to_circular_references'),
    };
  }
}

class DefaultEquality extends EqualityAssertionStrategy {
  appliesTo(_actual, _expected) {
    return true;
  }

  evaluate(actual, expected, _criteria) {
    return {
      comparisonResult: deepStrictEqual(actual, expected),
      additionalFailureMessage: () => I18nMessage.empty(),
    };
  }
}
