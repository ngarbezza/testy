'use strict';

const util = require('util');
const EqualityAssertionStrategy = require('./equality_assertion_strategy');
const { TestSucceeded, TestFailed } = require('./test_result');

const notPrefix = (boolean) => boolean ? '' : 'not ';

class TestResultReporter {
  constructor(runner) { this._runner = runner; }
  
  report(result) { this._runner.setResultForCurrentTest(result); }
}

class FailureGenerator extends TestResultReporter {
  with(description) {
    this.report(new TestFailed(description || "Explicitly failed"));
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
    const { comparisonResult, additionalFailureMessage } =
      EqualityAssertionStrategy.evaluate(this._actual, expected, criteria);
    
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
      this.report(new TestSucceeded());
    } else {
      const defaultFailureMessage = `Expected ${this._actualResultAsString()} to ${matcherFailureMessage}`;
      this.report(new TestFailed(overrideFailureMessage ? matcherFailureMessage : defaultFailureMessage));
    }
  }
  
  _actualResultAsString() { return this._prettyPrint(this._actual); }
  _prettyPrint(object) { return util.inspect(object); }
}

module.exports = { Asserter, FailureGenerator };
