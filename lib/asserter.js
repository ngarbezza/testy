'use strict';

const assert = require('assert');
const util = require('util');

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

const notPrefix = (boolean) => boolean ? '' : 'not ';

class TestResultReporter {
  constructor(runner) { this._runner = runner; }
  
  _result(success, failureMessage) { return { success: success, failureMessage: failureMessage }; }
  _report(result) { this._runner.setResultForCurrentTest(result); }
}

class FailureGenerator extends TestResultReporter {
  with(description) {
    this._report(this._result(false, description || "Explicitly failed"));
  }
}

class Asserter extends TestResultReporter {
  that(actual) { return new Assertion(this._runner, actual); }
  isTrue(actual) { return this.that(actual).isTrue(); }
  isFalse(actual) { return this.that(actual).isFalse(); }
  areEqual(actual, expected, criteria) { return this.that(actual).isEqualTo(expected, criteria); }
  areNotEqual(actual, expected) { return this.that(actual).isNotEqualTo(expected); }
}

class Assertion extends TestResultReporter {
  constructor(runner, actual) {
    super(runner);
    this._actual = actual;
  }
  
  isTrue() { this._booleanAssertion(true, 'true'); }
  isFalse() { this._booleanAssertion(false, 'false'); }
  isEqualTo(expected, criteria) { this._equalityAssertion(expected, criteria, true); }
  isNotEqualTo(expected, criteria) { this._equalityAssertion(expected, criteria, false); }
  includes(object) { this._evaluateAssertion(this._actual.includes(object), `include ${object}`); }
  raises(expectedError) { this._exceptionAssertion(expectedError, true); }
  doesNotRaise(notExpectedError) { this._exceptionAssertion(notExpectedError, false); }
  doesNotRaiseAnyErrors() {
    let match = false;
    let failureMessage = '';
    try {
      this._actual();
      match = true;
    } catch (error) {
      match = false;
      failureMessage = `Expected no errors to happen, but ${this._prettyPrint(error)} was raised`;
    } finally {
      this._evaluateAssertion(match, failureMessage, true);
    }
  }
  
  // private
  _equalityAssertion(expected, criteria, shouldBeEqual) {
    let comparisonResult = true;
    let additionalFailureMessage = '';
    if (typeof criteria === 'function') {
      comparisonResult = criteria(this._actual, expected);
    } else if (typeof criteria === 'string') {
      comparisonResult = this._actual[criteria](expected);
    } else if (this._actual.hasOwnProperty('equals')) {
      comparisonResult = this._actual.equals(expected);
    } else if (isCyclic(this._actual) || isCyclic(expected)) {
      comparisonResult = false;
      additionalFailureMessage = ' (circular references found, equality check cannot be done. Please compare objects\' properties individually)';
    } else {
      try { assert.deepStrictEqual(this._actual, expected); }
      catch (_assertionError) { comparisonResult = false; }
    }
    
    this._evaluateAssertion(
      shouldBeEqual ? comparisonResult : !comparisonResult,
      `${notPrefix(shouldBeEqual)}be equal to ${this._prettyPrint(expected)}${additionalFailureMessage}`
    );
  }
  
  _booleanAssertion(expectedBoolean, booleanString) {
    this._evaluateAssertion(this._actual === expectedBoolean, `be ${booleanString}`);
  }
  
  _exceptionAssertion(expectedError, shouldFail) {
    let match = false;
    try {
      this._actual();
      match = !shouldFail;
    } catch (actualError) {
      const errorCheck = actualError === expectedError;
      match = shouldFail ? errorCheck : !errorCheck;
    } finally {
      this._evaluateAssertion(match, `Expected error ${expectedError} ${notPrefix(shouldFail)} to happen`, true);
    }
  }
  
  _evaluateAssertion(matchingExpression, matcherFailureMessage, overrideFailureMessage) {
    if (matchingExpression) {
      this._report({success: true});
    } else {
      const defaultFailureMessage = `Expected ${this._actualResultAsString()} to ${matcherFailureMessage}`;
      this._report({
        success: false,
        failureMessage: overrideFailureMessage ? matcherFailureMessage : defaultFailureMessage
      });
    }
  }
  
  _actualResultAsString() { return this._prettyPrint(this._actual); }
  _prettyPrint(object) { return util.inspect(object); }
}

module.exports = { Asserter, FailureGenerator };
