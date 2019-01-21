'use strict';

const assert = require('assert');
const util = require('util');

function isCyclic(obj) {
  const seenObjects = [];
  
  function detect(obj) {
    if (typeof obj === 'object') {
      if (seenObjects.includes(obj)) return true;
      seenObjects.push(obj);
      let cycle = Object.keys(obj).find(key => detect(obj[key]));
      return !!cycle;
    }
    return false;
  }
  
  return detect(obj);
}

class Asserter {
  constructor(runner) { this._runner = runner; }
  
  registerAssertionResult(result) {
    this._runner.currentSuite().currentTest().setResult(result);
  }
  
  isEqualTo(expected, criteria) {
    return this._equalityAssertion(
      true, expected, criteria,
      (actual) => `Expected ${this._prettyPrint(actual)} to equal ${this._prettyPrint(expected)}`
    );
  }
  
  isNotEqualTo(expected, criteria) {
    return this._equalityAssertion(
      false, expected, criteria,
      (actual) => `Expected ${this._prettyPrint(actual)} to not equal ${this._prettyPrint(expected)}`
    );
  }
  
  includes(value) {
    return list => this._result(
      list.includes(value),
      `Expected ${this._prettyPrint(list)} to include ${this._prettyPrint(value)}`
    );
  }
  
  raises(expectedError) {
    return this._exceptionAssertion(
      () => this._failureResult(`Expected error ${this._prettyPrint(expectedError)} to happen`),
      this.isEqualTo(expectedError)
    );
  }
  
  doesNotRaise(notExpectedError) {
    return this._exceptionAssertion(
      this._successfulResult.bind(this),
      this.isNotEqualTo(notExpectedError)
    );
  }
  
  doesNotRaiseAnyErrors() {
    return this._exceptionAssertion(
      this._successfulResult.bind(this),
      (error) => this._failureResult(`Expected no errors to happen, but ${this._prettyPrint(error)} was raised`)
    );
  }
  
  _result(success, failureMessage) { return { success: success, failureMessage: failureMessage }; }
  _successfulResult() { return this._result(true, ""); }
  _failureResult(message) { return this._result(false, message); }
  
  assertThat(actual, expectation) {
    this.registerAssertionResult(expectation(actual));
  }
  assertEquals(actual, expected, criteria) {
    this.assertThat(actual, this.isEqualTo(expected, criteria));
  }
  assertTrue(boolean) { this.assertEquals(boolean, true); }
  assertFalse(boolean) { this.assertEquals(boolean, false); }
  
  fail(description) {
    let failureMessage = description || "Explicitly failed";
    this.registerAssertionResult(this._failureResult(failureMessage));
  }
  
  _prettyPrint(object) { return util.inspect(object); }
  
  _equalityAssertion(equal, expected, criteria, failureMessageBuilder) {
    return actual => {
      let success = equal;
      let additionalFailureMessage = '';
      if (typeof criteria === 'function')  {
        success = criteria(actual, expected);
      } else {
        if (isCyclic(actual) || isCyclic(expected)) {
          success = false;
          additionalFailureMessage = 'Circular dependencies found, equality check cannot be done. Please compare objects properties individually. ';
        } else {
          try { assert.deepStrictEqual(actual, expected); }
          catch (_assertionError) { success = !equal; }
        }
      }
  
      const failureMessage = failureMessageBuilder(actual);
      return this._result(success, `${additionalFailureMessage}${failureMessage}`);
    };
  }
  
  _exceptionAssertion(afterTry, afterCatch) {
    return code => {
      try {
        code();
        return afterTry();
      }
      catch(actualError) {
        return afterCatch(actualError);
      }
    };
  }
}

module.exports = Asserter;
