'use strict';

const util = require('util');
const EqualityAssertionStrategy = require('./equality_assertion_strategy');
const { TestSucceeded, TestFailed } = require('./test_result');

class TestResultReporter {
  constructor(runner) { this._runner = runner; }
  
  report(result) { this._runner.setResultForCurrentTest(result); }
  translated(key) { return this._runner._i18n.translate(key); }
}

class FailureGenerator extends TestResultReporter {
  with(description) {
    this.report(new TestFailed(description || this.translated('explicitly_failed')));
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
  
  // boolean assertions
  isTrue() { this._booleanAssertion(true, this.translated('be_true')); }
  isFalse() { this._booleanAssertion(false, this.translated('be_false')); }
  
  // equality assertions
  isEqualTo(expected, criteria) { this._equalityAssertion(expected, criteria, true); }
  isNotEqualTo(expected, criteria) { this._equalityAssertion(expected, criteria, false); }
  
  // collection assertions
  includes(object) { this._evaluateAssertion(this._actual.includes(object), `${this.translated('include')} ${object}`); }
  includesExactly(...objects) {
    this._evaluateAssertion(
      this._checkCollectionsHaveSameElements(this._actual, objects),
      `${this.translated('include_exactly')} ${this._prettyPrint(objects)}`
    );
  }
  
  // exception assertions
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
      failureMessage = `${this.translated('expected_no_errors')}, ${this.translated('but')} ${this._prettyPrint(error)} ${this.translated('was_raised')}`;
    } finally {
      this._evaluateAssertion(match, failureMessage, true);
    }
  }
  
  // private
  _equalityAssertion(expected, criteria, shouldBeEqual) {
    const { comparisonResult, additionalFailureMessage } =
      EqualityAssertionStrategy.evaluate(this._actual, expected, criteria);
  
    const expectationMessage = shouldBeEqual ? this.translated('be_equal_to') : this.translated('be_not_equal_to');
    this._evaluateAssertion(
      shouldBeEqual ? comparisonResult : !comparisonResult,
      `${expectationMessage} ${this._prettyPrint(expected)}${additionalFailureMessage}`
    );
  };
  
  _booleanAssertion(expectedBoolean, booleanString) {
    this._evaluateAssertion(this._actual === expectedBoolean, booleanString);
  }
  
  _exceptionAssertion(expectedError, shouldFail) {
    let match = false;
    let actualError = undefined;
    try {
      this._actual();
      match = !shouldFail;
    } catch (error) {
      actualError = error;
      const errorCheck = actualError === expectedError;
      match = shouldFail ? errorCheck : !errorCheck;
    } finally {
      const toHappenOrNot = shouldFail ? this.translated('to_happen') : this.translated('not_to_happen');
      const expectedErrorIntroduction = `${this.translated('expected')} ${this.translated('expecting_error')} ${this._prettyPrint(expectedError)} ${toHappenOrNot}`;
      const failureMessage = typeof actualError !== 'undefined' ?
          `${expectedErrorIntroduction}, ${this.translated('but_got')} ${this._prettyPrint(actualError)} ${this.translated('instead')}` : expectedErrorIntroduction;
      this._evaluateAssertion(match, failureMessage, true);
    }
  }
  
  _evaluateAssertion(matchingExpression, matcherFailureMessage, overrideFailureMessage) {
    if (matchingExpression) {
      this.report(new TestSucceeded());
    } else {
      const defaultFailureMessage = `${this.translated('expected')} ${this._actualResultAsString()} ${this.translated('to')}${matcherFailureMessage}`;
      this.report(new TestFailed(overrideFailureMessage ? matcherFailureMessage : defaultFailureMessage));
    }
  }
  
  _actualResultAsString() { return this._prettyPrint(this._actual); }
  _prettyPrint(object) { return util.inspect(object); }
  
  _checkCollectionsHaveSameElements(collectionOne, collectionTwo) {
    if (collectionOne.length !== collectionTwo.length) return false;
    for (let i = 0; i < collectionOne.length; i++) {
      if (!collectionOne.includes(collectionTwo[i]) || !collectionTwo.includes(collectionOne[i])) return false;
    }
    return true;
  }
}

module.exports = { Asserter, FailureGenerator };
