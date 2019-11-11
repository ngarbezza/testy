'use strict';

const util = require('util');
const EqualityAssertionStrategy = require('./equality_assertion_strategy');
const TestResult = require('./test_result');

class TestResultReporter {
  constructor(runner) {
    this._runner = runner;
  }
  
  report(result) {
    this._runner.setResultForCurrentTest(result);
  }
  
  translated(key) {
    return this._runner._i18n.translate(key);
  }
}

class FailureGenerator extends TestResultReporter {
  with(description) {
    this.report(TestResult.failure(description || this.translated('explicitly_failed')));
  }
}

class PendingMarker extends TestResultReporter {
  dueTo(reason) {
    this.report(TestResult.explicitlyMarkedAsPending(reason));
  }
}

class Asserter extends TestResultReporter {
  that(actual) {
    return new Assertion(this._runner, actual);
  }
  
  isTrue(actual) {
    return this.that(actual).isTrue();
  }
  
  isFalse(actual) {
    return this.that(actual).isFalse();
  }
  
  areEqual(actual, expected, criteria) {
    return this.that(actual).isEqualTo(expected, criteria);
  }
  
  areNotEqual(actual, expected) {
    return this.that(actual).isNotEqualTo(expected);
  }
  
  isEmpty(actual) {
    return this.that(actual).isEmpty();
  }
  
  isNotEmpty(actual) {
    return this.that(actual).isNotEmpty();
  }
}

class Assertion extends TestResultReporter {
  constructor(runner, actual) {
    super(runner);
    this._actual = actual;
  }
  
  // Boolean assertions
  
  isTrue() {
    this._booleanAssertion(true, this.translated('be_true'));
  }
  
  isFalse() {
    this._booleanAssertion(false, this.translated('be_false'));
  }
  
  // Equality assertions
  
  isEqualTo(expected, criteria) {
    this._equalityAssertion(expected, criteria, true);
  }
  
  isNotEqualTo(expected, criteria) {
    this._equalityAssertion(expected, criteria, false);
  }
  
  // Collection assertions
  
  includes(object) {
    const resultIsSuccessful = this._actual.includes(object);
    const failureMessage = `${this.translated('include')} ${object}`;
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  doesNotInclude(object) {
    const resultIsSuccessful = !this._actual.includes(object);
    const failureMessage = `${this.translated('not_include')} ${object}`;
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  includesExactly(...objects) {
    const resultIsSuccessful = this._checkCollectionsHaveSameElements(this._actual, objects);
    const failureMessage = `${this.translated('include_exactly')} ${this._prettyPrint(objects)}`;
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  isEmpty() {
    const resultIsSuccessful = this._actual.length === 0;
    const failureMessage = this.translated('be_empty');
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  isNotEmpty() {
    const resultIsSuccessful = this._actual.length > 0;
    const failureMessage = this.translated('be_not_empty');
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  // Exception assertions
  
  raises(errorExpectation) {
    this._exceptionAssertion(errorExpectation, true);
  }
  
  doesNotRaise(notExpectedError) {
    this._exceptionAssertion(notExpectedError, false);
  }
  
  doesNotRaiseAnyErrors() {
    let noErrorsOccurred = false;
    let failureMessage = '';
    try {
      this._actual.call();
      noErrorsOccurred = true;
    } catch (error) {
      noErrorsOccurred = false;
      failureMessage = `${this.translated('expected_no_errors')}, ${this.translated('but')} ${this._prettyPrint(error)} ${this.translated('was_raised')}`;
    } finally {
      this._reportAssertionResult(noErrorsOccurred, failureMessage, true);
    }
  }
  
  // Private
  
  _equalityAssertion(expected, criteria, shouldBeEqual) {
    const { comparisonResult, additionalFailureMessage } =
      EqualityAssertionStrategy.evaluate(this._actual, expected, criteria);
  
    const expectationMessage = shouldBeEqual ? this.translated('be_equal_to') : this.translated('be_not_equal_to');
    const resultIsSuccessful = shouldBeEqual ? comparisonResult : !comparisonResult;
    const failureMessage = `${expectationMessage} ${this._prettyPrint(expected)}${additionalFailureMessage}`;
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  };
  
  _booleanAssertion(expectedBoolean, failureMessage) {
    const resultIsSuccessful = this._actual === expectedBoolean;
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  _exceptionAssertion(errorExpectation, shouldFail) {
    let hasFailed = false;
    let actualError = undefined;
    try {
      this._actual();
      hasFailed = !shouldFail;
    } catch (error) {
      actualError = error;
      let errorCheck = this._checkIfErrorMatchesExpectation(errorExpectation, actualError);
      hasFailed = shouldFail ? errorCheck : !errorCheck;
    } finally {
      const toHappenOrNot = shouldFail ? this.translated('to_happen') : this.translated('not_to_happen');
      const expectedErrorIntroduction = `${this.translated('expected')} ${this.translated('expecting_error')} ${this._prettyPrint(errorExpectation)} ${toHappenOrNot}`;
      const failureMessage = typeof actualError !== 'undefined' ?
          `${expectedErrorIntroduction}, ${this.translated('but_got')} ${this._prettyPrint(actualError)} ${this.translated('instead')}` : expectedErrorIntroduction;
      this._reportAssertionResult(hasFailed, failureMessage, true);
    }
  }
  
  _checkIfErrorMatchesExpectation(errorExpectation, actualError) {
    const expectationIsRegex = errorExpectation.__proto__.hasOwnProperty('test');
    if (expectationIsRegex) {
      return errorExpectation.test(actualError);
    } else {
      return actualError === errorExpectation;
    }
  }
  
  _reportAssertionResult(wasSuccess, matcherFailureMessage, overrideFailureMessage) {
    if (wasSuccess) {
      this.report(TestResult.success());
    } else {
      const defaultFailureMessage = `${this.translated('expected')} ${this._actualResultAsString()} ${this.translated('to')}${matcherFailureMessage}`;
      this.report(TestResult.failure(overrideFailureMessage ? matcherFailureMessage : defaultFailureMessage));
    }
  }
  
  _actualResultAsString() {
    return this._prettyPrint(this._actual);
  }
  
  _prettyPrint(object) {
    return util.inspect(object);
  }
  
  _checkCollectionsHaveSameElements(collectionOne, collectionTwo) {
    const collectionOneArray = Array.from(collectionOne);
    const collectionTwoArray = Array.from(collectionTwo);
    if (collectionOneArray.length !== collectionTwoArray.length) return false;
    for (let i = 0; i < collectionOne.length; i++) {
      const includedInOne = collectionOneArray.includes(collectionTwoArray[i]);
      const includedInTwo = collectionTwoArray.includes(collectionOneArray[i]);
      if (!includedInOne || !includedInTwo) return false;
    }
    return true;
  }
}

module.exports = { Asserter, FailureGenerator, PendingMarker };
