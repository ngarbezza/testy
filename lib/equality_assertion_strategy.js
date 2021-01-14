'use strict';

const { I18nMessage } = require('./i18n');
const { isString, isFunction, isUndefined, respondsTo, isCyclic, deepStrictEqual } = require('./utils');

const EqualityAssertionStrategy = {
  availableStrategies() {
    return [
      BothPartsUndefined,
      CustomFunction,
      CustomPropertyName,
      ObjectWithEqualsProperty,
      ObjectWithCyclicReference,
      DefaultEquality,
    ];
  },
  
  evaluate(actual, expected, criteria) {
    return this.availableStrategies()
      .find(strategy => strategy.appliesTo(actual, expected, criteria))
      .evaluate(actual, expected, criteria);
  },
};

const BothPartsUndefined = {
  __proto__: EqualityAssertionStrategy,
  
  appliesTo(actual, expected) {
    return isUndefined(actual) && isUndefined(expected);
  },
  
  evaluate() {
    return {
      comparisonResult: false,
      overrideFailureMessage: () => I18nMessage.of('equality_assertion_failed_due_to_undetermination'),
    };
  },
};

const CustomFunction = {
  __proto__: EqualityAssertionStrategy,
  
  appliesTo(actual, expected, criteria) {
    return isFunction(criteria);
  },
  
  evaluate(actual, expected, criteria) {
    return {
      comparisonResult: criteria(actual, expected),
      additionalFailureMessage: () => I18nMessage.empty(),
    };
  },
};

const CustomPropertyName = {
  __proto__: EqualityAssertionStrategy,
  
  appliesTo(actual, expected, criteria) {
    return isString(criteria);
  },
  
  evaluate(actual, expected, criteria) {
    if (this._comparisonCanBeMade(actual, expected, criteria)) {
      return this._compareUsingCustomCriteria(actual, expected, criteria);
    } else {
      return this._failWithCriteriaNotFoundMessage(criteria);
    }
  },
  
  _comparisonCanBeMade(actual, expected, criteria) {
    return respondsTo(actual, criteria) && respondsTo(expected, criteria);
  },
  
  _compareUsingCustomCriteria(actual, expected, criteria) {
    return {
      comparisonResult: actual[criteria](expected),
      additionalFailureMessage: () => I18nMessage.empty(),
    };
  },
  
  _failWithCriteriaNotFoundMessage(criteria) {
    return {
      comparisonResult: false,
      additionalFailureMessage: () => I18nMessage.of('equality_assertion_failed_due_to_missing_property', criteria),
    };
  },
};

const ObjectWithEqualsProperty = {
  __proto__: EqualityAssertionStrategy,
  
  appliesTo(actual, _expected) {
    return respondsTo(actual, 'equals');
  },
  
  evaluate(actual, expected) {
    return {
      comparisonResult: actual.equals(expected),
      additionalFailureMessage: () => I18nMessage.empty(),
    };
  },
};

const ObjectWithCyclicReference = {
  __proto__: EqualityAssertionStrategy,
  
  appliesTo(actual, expected) {
    return isCyclic(actual) || isCyclic(expected);
  },
  
  evaluate(_actual, _expected) {
    return {
      comparisonResult: false,
      additionalFailureMessage: () => I18nMessage.of('equality_assertion_failed_due_to_circular_references'),
    };
  },
};

const DefaultEquality = {
  __proto__: EqualityAssertionStrategy,
  
  appliesTo(_actual, _expected) {
    return true;
  },
  
  evaluate(actual, expected) {
    return {
      comparisonResult: deepStrictEqual(actual, expected),
      additionalFailureMessage: () => I18nMessage.empty(),
    };
  },
};

module.exports = EqualityAssertionStrategy;
