'use strict';

const assert = require('assert');

function isCyclic(obj) {
  if (obj === null) { return false; }
  const seenObjects = [];
  
  function detect(obj) {
    if (typeof obj === 'object') {
      if (seenObjects.includes(obj)) return true;
      seenObjects.push(obj);
      return !!Object.keys(obj).find(key => detect(obj[key]));
    }
    return false;
  }
  
  return detect(obj);
}

function notNullOrUndefined(object) {
  return object !== undefined && object !== null;
}

function hasMethodDefined(object, method) {
  return notNullOrUndefined(object) && typeof object[method] === 'function';
}

const EqualityAssertionStrategy = {
  availableStrategies() {
    return [
      CustomFunction,
      CustomPropertyName,
      ObjectWithEqualsProperty,
      ObjectWithCyclicReference,
      DefaultEquality,
    ];
  },
  
  evaluate(actual, expected, criteria) {
    return this.availableStrategies().
      find(strategy => strategy.appliesTo(actual, expected, criteria)).
      evaluate(actual, expected, criteria);
  },
};

const CustomFunction = {
  __proto__: EqualityAssertionStrategy,
  
  appliesTo(actual, expected, criteria) {
    return typeof criteria === 'function';
  },
  
  evaluate(actual, expected, criteria) {
    return {
      comparisonResult: criteria(actual, expected),
      additionalFailureMessage: ''
    };
  },
};

const CustomPropertyName = {
  __proto__: EqualityAssertionStrategy,
  
  appliesTo(actual, expected, criteria)  {
    return typeof criteria === 'string';
  },
  
  evaluate(actual, expected, criteria) {
    if (this._comparisonCanBeMade(actual, expected, criteria)) {
      return this._compareUsingCustomCriteria(actual, expected, criteria);
    } else {
      return this._failWithCriteriaNotFoundMessage(criteria);
    }
  },
  
  _comparisonCanBeMade(actual, expected, criteria) {
    return hasMethodDefined(actual, criteria) && hasMethodDefined(expected, criteria);
  },
  
  _compareUsingCustomCriteria(actual, expected, criteria) {
    return {
      comparisonResult: actual[criteria](expected),
      additionalFailureMessage: ''
    };
  },
  
  _failWithCriteriaNotFoundMessage(criteria) {
    return {
      comparisonResult: false,
      additionalFailureMessage: ` Equality check failed. Objects do not have '${criteria}' property`
    };
  },
};

const ObjectWithEqualsProperty = {
  __proto__: EqualityAssertionStrategy,
  
  appliesTo(actual, expected) {
    return hasMethodDefined(actual, 'equals')
  },
  
  evaluate(actual, expected) {
    return {
      comparisonResult: actual.equals(expected),
      additionalFailureMessage: ''
    };
  },
};

const ObjectWithCyclicReference = {
  __proto__: EqualityAssertionStrategy,
  
  appliesTo(actual, expected) {
    return isCyclic(actual) || isCyclic(expected);
  },
  
  evaluate(actual, expected) {
    return {
      comparisonResult: false,
      additionalFailureMessage: ' (circular references found, equality check cannot be done. Please compare objects\' properties individually)'
    };
  },
};

const DefaultEquality = {
  __proto__: EqualityAssertionStrategy,
  
  appliesTo(actual, expected) {
    return true;
  },
  
  evaluate(actual, expected) {
    let comparisonResult = true;
    try {
      assert.deepStrictEqual(actual, expected);
    } catch (_assertionError) {
      comparisonResult = false;
    }
    return {
      comparisonResult: comparisonResult,
      additionalFailureMessage: ''
    };
  },
};

module.exports = EqualityAssertionStrategy;
