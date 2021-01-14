'use strict';

const TestResultReporter = require('./test_result_reporter');
const EqualityAssertionStrategy = require('./equality_assertion_strategy');
const { I18nMessage } = require('./i18n');

const { prettyPrint, isUndefined, isRegex, notNullOrUndefined, numberOfElements, convertToArray } = require('./utils');

class Assertion extends TestResultReporter {
  constructor(runner, actual) {
    super(runner);
    this._actual = actual;
  }
  
  // Boolean assertions
  
  isTrue() {
    this._reportAssertionResult(
      this._actual === true,
      () => I18nMessage.of('expectation_be_true', this._actualResultAsString()),
    );
  }
  
  isFalse() {
    this._reportAssertionResult(
      this._actual === false,
      () => I18nMessage.of('expectation_be_false', this._actualResultAsString()),
    );
  }
  
  // Undefined value assertions
  
  isUndefined() {
    this._reportAssertionResult(
      isUndefined(this._actual),
      () => I18nMessage.of('expectation_be_undefined', this._actualResultAsString()),
    );
  }
  
  isNotUndefined() {
    this._reportAssertionResult(
      !isUndefined(this._actual),
      () => I18nMessage.of('expectation_be_defined', this._actualResultAsString()),
    );
  }
  
  // Null value assertions
  
  isNull() {
    this._reportAssertionResult(
      this._actual === null,
      () => I18nMessage.of('expectation_be_null', this._actualResultAsString()),
    );
  }
  
  isNotNull() {
    this._reportAssertionResult(
      this._actual !== null,
      () => I18nMessage.of('expectation_be_not_null', this._actualResultAsString()),
    );
  }
  
  // Equality assertions
  
  isEqualTo(expected, criteria) {
    this._equalityAssertion(expected, criteria, true);
  }
  
  isNotEqualTo(expected, criteria) {
    this._equalityAssertion(expected, criteria, false);
  }
  
  // Collection assertions
  
  includes(expectedObject, equalityCriteria) {
    const resultIsSuccessful = convertToArray(this._actual).find(element =>
      this._areConsideredEqual(element, expectedObject, equalityCriteria));
    const failureMessage = () => I18nMessage.of('expectation_include', this._actualResultAsString(), prettyPrint(expectedObject));
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  isIncludedIn(expectedCollection, equalityCriteria) {
    const resultIsSuccessful = expectedCollection.find(element =>
      this._areConsideredEqual(element, this._actual, equalityCriteria));
    const failureMessage = () => I18nMessage.of('expectation_be_included_in', this._actualResultAsString(), prettyPrint(expectedCollection));
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  doesNotInclude(expectedObject, equalityCriteria) {
    const resultIsSuccessful = !convertToArray(this._actual).find(element =>
      this._areConsideredEqual(element, expectedObject, equalityCriteria));
    const failureMessage = () => I18nMessage.of('expectation_not_include', this._actualResultAsString(), prettyPrint(expectedObject));
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  isNotIncludedIn(expectedCollection, equalityCriteria) {
    const resultIsSuccessful = !expectedCollection.find(element =>
      this._areConsideredEqual(element, this._actual, equalityCriteria));
    const failureMessage = () => I18nMessage.of('expectation_be_not_included_in', this._actualResultAsString(), prettyPrint(expectedCollection));
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  includesExactly(...objects) {
    const resultIsSuccessful = this._haveElementsConsideredEqual(this._actual, objects);
    const failureMessage = () => I18nMessage.of('expectation_include_exactly', this._actualResultAsString(), prettyPrint(objects));
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  isEmpty() {
    const resultIsSuccessful = numberOfElements(this._actual || {}) === 0 && notNullOrUndefined(this._actual);
    const failureMessage = () => I18nMessage.of('expectation_be_empty', this._actualResultAsString());
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  isNotEmpty() {
    const setValueWhenUndefined = this._actual || {};
    const resultIsSuccessful = numberOfElements(setValueWhenUndefined) > 0;
    const failureMessage = () => I18nMessage.of('expectation_be_not_empty', this._actualResultAsString());
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  // Exception assertions
  
  raises(errorExpectation) {
    try {
      this._actual.call();
      this.reportFailure(I18nMessage.of('expectation_error', prettyPrint(errorExpectation)));
    } catch (actualError) {
      const assertionPassed = this._checkIfErrorMatchesExpectation(errorExpectation, actualError);
      const errorMessage = () => I18nMessage.of('expectation_different_error', prettyPrint(errorExpectation), prettyPrint(actualError));
      this._reportAssertionResult(assertionPassed, errorMessage);
    }
  }
  
  doesNotRaise(notExpectedError) {
    try {
      this._actual.call();
      this.reportSuccess();
    } catch (actualError) {
      const errorCheck = this._checkIfErrorMatchesExpectation(notExpectedError, actualError);
      const failureMessage = () => I18nMessage.of('expectation_no_error', prettyPrint(actualError));
      this._reportAssertionResult(!errorCheck, failureMessage);
    }
  }
  
  doesNotRaiseAnyErrors() {
    try {
      this._actual.call();
      this.reportSuccess(true);
    } catch (error) {
      this.reportFailure(I18nMessage.of('expectation_no_errors', prettyPrint(error)));
    }
  }
  
  // Numeric assertions
  
  isNearTo(number, precisionDigits = 4) {
    const result = Number.parseFloat((this._actual).toFixed(precisionDigits)) === number;
    const failureMessage = () => I18nMessage.of('expectation_be_near_to', this._actualResultAsString(), number.toString(), precisionDigits.toString());
    this._reportAssertionResult(result, failureMessage);
  }
  
  // String assertions
  
  matches(regex) {
    const result = this._actual.match(regex);
    const failureMessage = () => I18nMessage.of('expectation_match_regex', this._actualResultAsString(), regex);
    this._reportAssertionResult(result, failureMessage);
  }
  
  // Private
  
  _equalityAssertion(expected, criteria, shouldBeEqual) {
    const { comparisonResult, additionalFailureMessage, overrideFailureMessage } =
      EqualityAssertionStrategy.evaluate(this._actual, expected, criteria);
    const resultIsSuccessful = shouldBeEqual ? comparisonResult : !comparisonResult;
    
    if (overrideFailureMessage) {
      this._reportAssertionResult(resultIsSuccessful, overrideFailureMessage);
    } else {
      const expectationMessageKey = shouldBeEqual ? 'equality_assertion_be_equal_to' : 'equality_assertion_be_not_equal_to';
      const expectationMessage = () => I18nMessage.of(expectationMessageKey, this._actualResultAsString(), prettyPrint(expected));
      const finalMessage = () => I18nMessage.joined([expectationMessage.call(), additionalFailureMessage.call()], ' ');
      this._reportAssertionResult(resultIsSuccessful, finalMessage);
    }
  }
  
  _areConsideredEqual(objectOne, objectTwo, equalityCriteria) {
    return EqualityAssertionStrategy.evaluate(objectOne, objectTwo, equalityCriteria).comparisonResult;
  }
  
  _checkIfErrorMatchesExpectation(errorExpectation, actualError) {
    if (isRegex(errorExpectation)) {
      return errorExpectation.test(actualError);
    } else {
      return this._areConsideredEqual(actualError, errorExpectation);
    }
  }
  
  _reportAssertionResult(wasSuccess, failureMessage) {
    if (wasSuccess) {
      this.reportSuccess();
    } else {
      this.reportFailure(failureMessage.call());
    }
  }
  
  _actualResultAsString() {
    return prettyPrint(this._actual);
  }
  
  _haveElementsConsideredEqual(collectionOne, collectionTwo) {
    const collectionOneArray = Array.from(collectionOne);
    const collectionTwoArray = Array.from(collectionTwo);
    if (collectionOneArray.length !== collectionTwoArray.length) {
      return false;
    }
    for (let index = 0; index < collectionOne.length; index++) {
      const includedInOne = collectionOne.find(element =>
        this._areConsideredEqual(element, collectionTwoArray[index]));
      const includedInTwo = collectionTwo.find(element =>
        this._areConsideredEqual(element, collectionOneArray[index]));
      if (!includedInOne || !includedInTwo) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Assertion;
