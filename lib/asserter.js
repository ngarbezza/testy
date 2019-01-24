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

function notPrefix(boolean) { return boolean ? '' : 'not '; }

function fail(description) {
  let result = { success: false, failureMessage: description || "Explicitly failed" };
  global.__testy__.currentSuite().currentTest().setResult(result);
}

class Asserter {
  static that(actual) { return new Asserter(actual); }
  static isTrue(actual) { return Asserter.that(actual).isTrue(); }
  static isFalse(actual) { return Asserter.that(actual).isFalse(); }
  static areEqual(actual, expected, criteria) { return Asserter.that(actual).isEqualTo(expected, criteria); }
  static areNotEqual(actual, expected) { return Asserter.that(actual).isNotEqualTo(expected); }
  
  constructor(actualResult) {
    this._actualResult = actualResult;
  }
  
  isTrue() { this._booleanAssertion(true, 'true'); }
  isFalse() { this._booleanAssertion(false, 'false'); }
  isEqualTo(expected, criteria) { this._equalityAssertion(expected, criteria, true); }
  isNotEqualTo(expected, criteria) { this._equalityAssertion(expected, criteria, false); }
  includes(object) { this._evaluateAssertion(this._actualResult.includes(object), `include ${object}`); }
  raises(expectedError) { this._exceptionAssertion(expectedError, true); }
  doesNotRaise(notExpectedError) { this._exceptionAssertion(notExpectedError, false); }
  doesNotRaiseAnyErrors() {
    let match = false;
    let failureMessage = '';
    try {
      this._actualResult();
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
      comparisonResult = criteria(this._actualResult, expected);
    } else {
      if (isCyclic(this._actualResult) || isCyclic(expected)) {
        comparisonResult = false;
        additionalFailureMessage = ' (circular dependencies found, equality check cannot be done. Please compare objects\' properties individually)';
      } else {
        try { assert.deepStrictEqual(this._actualResult, expected); }
        catch (_assertionError) { comparisonResult = false; }
      }
    }
    
    this._evaluateAssertion(
      shouldBeEqual ? comparisonResult : !comparisonResult,
      `${notPrefix(shouldBeEqual)}be equal to ${this._prettyPrint(expected)}${additionalFailureMessage}`
    );
  }
  
  _booleanAssertion(expectedBoolean, booleanString) {
    this._evaluateAssertion(this._actualResult === expectedBoolean, `be ${booleanString}`);
  }
  
  _exceptionAssertion(expectedError, shouldFail) {
    let match = false;
    try {
      this._actualResult();
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
      this._registerAssertionResult({success: true});
    } else {
      const defaultFailureMessage = `Expected ${this._actualResultAsString()} to ${matcherFailureMessage}`;
      this._registerAssertionResult({
        success: false,
        failureMessage: overrideFailureMessage ? matcherFailureMessage : defaultFailureMessage
      });
    }
  }
  
  _registerAssertionResult(result) {
    global.__testy__.currentSuite().currentTest().setResult(result);
  }
  
  _result(success, failureMessage) { return { success: success, failureMessage: failureMessage }; }
  
  _actualResultAsString() { return this._prettyPrint(this._actualResult); }
  
  _prettyPrint(object) { return util.inspect(object); }
}

module.exports = { Asserter, fail };
