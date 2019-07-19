'use strict';

const assert = require('assert');

function isCyclic(obj) {
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

const EqualityAssertionStrategy = {
  evaluate(actual, expected, criteria) {
    const availableStrategies = [
      CustomFunction,
      CustomPropertyName,
      ObjectWithEqualsProperty,
      ObjectWithCyclicReference,
      DefaultEquality,
    ];
    return availableStrategies.
    find(strategy => strategy.appliesTo(actual, expected, criteria)).
    evaluate(actual, expected, criteria);
  }
};

const CustomFunction = {
  __proto__: EqualityAssertionStrategy,
  appliesTo: (actual, expected, criteria) => typeof criteria === 'function',
  evaluate: (actual, expected, criteria) => {
    return {
      comparisonResult: criteria(actual, expected),
      additionalFailureMessage: ''
    };
  }
};

const CustomPropertyName = {
  __proto__: EqualityAssertionStrategy,
  appliesTo: (actual, expected, criteria) => typeof criteria === 'string',
  evaluate: (actual, expected, criteria) => {
    return {
      comparisonResult: actual[criteria](expected),
      additionalFailureMessage: ''
    };
  }
};

const ObjectWithEqualsProperty = {
  __proto__: EqualityAssertionStrategy,
  appliesTo: actual => actual.hasOwnProperty('equals'),
  evaluate: (actual, expected) => {
    return {
      comparisonResult: actual.equals(expected),
      additionalFailureMessage: ''
    };
  }
};

const ObjectWithCyclicReference = {
  __proto__: EqualityAssertionStrategy,
  appliesTo: (actual, expected) => isCyclic(actual) || isCyclic(expected),
  evaluate: () => {
    return {
      comparisonResult: false,
      additionalFailureMessage: ' (circular references found, equality check cannot be done. Please compare objects\' properties individually)'
    };
  }
};

const DefaultEquality = {
  __proto__: EqualityAssertionStrategy,
  appliesTo: () => true,
  evaluate: (actual, expected) => {
    let comparisonResult = true;
    try { assert.deepStrictEqual(actual, expected); }
    catch (_assertionError) { comparisonResult = false; }
    return {
      comparisonResult: comparisonResult,
      additionalFailureMessage: ''
    };
  }
};

module.exports = EqualityAssertionStrategy;
