'use strict';

const TestResultReporter = require('./test_result_reporter');
const EqualityAssertionStrategy = require('./equality_assertion_strategy');
const IdentityAssertionStrategy = require('./identity_assertion_strategy');
const { I18nMessage } = require('./i18n');

const { prettyPrint, isUndefined, isRegex, notNullOrUndefined, numberOfElements, convertToArray } = require('./utils');

class Assertion extends TestResultReporter {
  #actual;
  constructor(runner, actual) {
    super(runner);
    this.#actual = actual;
  }
  
  // Boolean assertions
  
  isTrue() {
    this.#reportAssertionResult(
      this.#actual === true,
      () => I18nMessage.of('expectation_be_true', this.#actualResultAsString()),
    );
  }
  
  isFalse() {
    this.#reportAssertionResult(
      this.#actual === false,
      () => I18nMessage.of('expectation_be_false', this.#actualResultAsString()),
    );
  }
  
  // Undefined value assertions
  
  isUndefined() {
    this.#reportAssertionResult(
      isUndefined(this.#actual),
      () => I18nMessage.of('expectation_be_undefined', this.#actualResultAsString()),
    );
  }
  
  isNotUndefined() {
    this.#reportAssertionResult(
      !isUndefined(this.#actual),
      () => I18nMessage.of('expectation_be_defined', this.#actualResultAsString()),
    );
  }
  
  // Null value assertions
  
  isNull() {
    this.#reportAssertionResult(
      this.#actual === null,
      () => I18nMessage.of('expectation_be_null', this.#actualResultAsString()),
    );
  }
  
  isNotNull() {
    this.#reportAssertionResult(
      this.#actual !== null,
      () => I18nMessage.of('expectation_be_not_null', this.#actualResultAsString()),
    );
  }
  
  // Equality assertions
  
  isEqualTo(expected, criteria) {
    this.#equalityAssertion(expected, criteria, true);
  }
  
  isNotEqualTo(expected, criteria) {
    this.#equalityAssertion(expected, criteria, false);
  }

  // Identity assertions

  isIdenticalTo(expected) {
    this.#identityAssertion(expected, true);
  }

  isNotIdenticalTo(expected) {
    this.#identityAssertion(expected, false);
  }
  
  // Collection assertions
  
  includes(expectedObject, equalityCriteria) {
    const resultIsSuccessful = convertToArray(this.#actual).find(element =>
      this.#areConsideredEqual(element, expectedObject, equalityCriteria));
    const failureMessage = () => I18nMessage.of('expectation_include', this.#actualResultAsString(), prettyPrint(expectedObject));
    this.#reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  isIncludedIn(expectedCollection, equalityCriteria) {
    const resultIsSuccessful = expectedCollection.find(element =>
      this.#areConsideredEqual(element, this.#actual, equalityCriteria));
    const failureMessage = () => I18nMessage.of('expectation_be_included_in', this.#actualResultAsString(), prettyPrint(expectedCollection));
    this.#reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  doesNotInclude(expectedObject, equalityCriteria) {
    const resultIsSuccessful = !convertToArray(this.#actual).find(element =>
      this.#areConsideredEqual(element, expectedObject, equalityCriteria));
    const failureMessage = () => I18nMessage.of('expectation_not_include', this.#actualResultAsString(), prettyPrint(expectedObject));
    this.#reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  isNotIncludedIn(expectedCollection, equalityCriteria) {
    const resultIsSuccessful = !expectedCollection.find(element =>
      this.#areConsideredEqual(element, this.#actual, equalityCriteria));
    const failureMessage = () => I18nMessage.of('expectation_be_not_included_in', this.#actualResultAsString(), prettyPrint(expectedCollection));
    this.#reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  includesExactly(...objects) {
    const resultIsSuccessful = this.#haveElementsConsideredEqual(this.#actual, objects);
    const failureMessage = () => I18nMessage.of('expectation_include_exactly', this.#actualResultAsString(), prettyPrint(objects));
    this.#reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  isEmpty() {
    const resultIsSuccessful = numberOfElements(this.#actual || {}) === 0 && notNullOrUndefined(this.#actual);
    const failureMessage = () => I18nMessage.of('expectation_be_empty', this.#actualResultAsString());
    this.#reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  isNotEmpty() {
    const setValueWhenUndefined = this.#actual || {};
    const resultIsSuccessful = numberOfElements(setValueWhenUndefined) > 0;
    const failureMessage = () => I18nMessage.of('expectation_be_not_empty', this.#actualResultAsString());
    this.#reportAssertionResult(resultIsSuccessful, failureMessage);
  }
  
  // Exception assertions
  
  raises(errorExpectation) {
    try {
      this.#actual.call();
      this.reportFailure(I18nMessage.of('expectation_error', prettyPrint(errorExpectation)));
    } catch (actualError) {
      const assertionPassed = this.#checkIfErrorMatchesExpectation(errorExpectation, actualError);
      const errorMessage = () => I18nMessage.of('expectation_different_error', prettyPrint(errorExpectation), prettyPrint(actualError));
      this.#reportAssertionResult(assertionPassed, errorMessage);
    }
  }
  
  doesNotRaise(notExpectedError) {
    try {
      this.#actual.call();
      this.reportSuccess();
    } catch (actualError) {
      const errorCheck = this.#checkIfErrorMatchesExpectation(notExpectedError, actualError);
      const failureMessage = () => I18nMessage.of('expectation_no_error', prettyPrint(actualError));
      this.#reportAssertionResult(!errorCheck, failureMessage);
    }
  }
  
  doesNotRaiseAnyErrors() {
    try {
      this.#actual.call();
      this.reportSuccess(true);
    } catch (error) {
      this.reportFailure(I18nMessage.of('expectation_no_errors', prettyPrint(error)));
    }
  }
  
  // Numeric assertions
  
  isNearTo(number, precisionDigits = 4) {
    const result = Number.parseFloat((this.#actual).toFixed(precisionDigits)) === number;
    const failureMessage = () => I18nMessage.of('expectation_be_near_to', this.#actualResultAsString(), number.toString(), precisionDigits.toString());
    this.#reportAssertionResult(result, failureMessage);
  }
  
  // String assertions
  
  matches(regex) {
    const result = this.#actual.match(regex);
    const failureMessage = () => I18nMessage.of('expectation_match_regex', this.#actualResultAsString(), regex);
    this.#reportAssertionResult(result, failureMessage);
  }
  
  // Private

  #identityAssertion(expected, shouldBeIdentical) {
    const { comparisonResult, overrideFailureMessage } =
      IdentityAssertionStrategy.evaluate(this.#actual, expected);
    const resultIsSuccessful = shouldBeIdentical ? comparisonResult : !comparisonResult;

    if (isUndefined(comparisonResult)) {
      this.#reportAssertionResult(false, overrideFailureMessage);
    } else {
      const expectationMessageKey = shouldBeIdentical ? 'identity_assertion_be_identical_to' : 'identity_assertion_be_not_identical_to';
      const expectationMessage = () => I18nMessage.of(expectationMessageKey, this.#actualResultAsString(), prettyPrint(expected));
      this.#reportAssertionResult(resultIsSuccessful, expectationMessage);
    }
  }
  
  #equalityAssertion(expected, criteria, shouldBeEqual) {
    const { comparisonResult, additionalFailureMessage, overrideFailureMessage } =
      EqualityAssertionStrategy.evaluate(this.#actual, expected, criteria);
    const resultIsSuccessful = shouldBeEqual ? comparisonResult : !comparisonResult;
    
    if (isUndefined(comparisonResult)) {
      this.#reportAssertionResult(false, overrideFailureMessage);
    } else {
      const expectationMessageKey = shouldBeEqual ? 'equality_assertion_be_equal_to' : 'equality_assertion_be_not_equal_to';
      const expectationMessage = () => I18nMessage.of(expectationMessageKey, this.#actualResultAsString(), prettyPrint(expected));
      const finalMessage = () => I18nMessage.joined([expectationMessage.call(), additionalFailureMessage.call()], ' ');
      this.#reportAssertionResult(resultIsSuccessful, finalMessage);
    }
  }
  
  #areConsideredEqual(objectOne, objectTwo, equalityCriteria) {
    return EqualityAssertionStrategy.evaluate(objectOne, objectTwo, equalityCriteria).comparisonResult;
  }
  
  #checkIfErrorMatchesExpectation(errorExpectation, actualError) {
    if (isRegex(errorExpectation)) {
      return errorExpectation.test(actualError);
    } else {
      return this.#areConsideredEqual(actualError, errorExpectation);
    }
  }
  
  #reportAssertionResult(wasSuccess, failureMessage) {
    if (wasSuccess) {
      this.reportSuccess();
    } else {
      this.reportFailure(failureMessage.call());
    }
  }
  
  #actualResultAsString() {
    return prettyPrint(this.#actual);
  }
  
  #haveElementsConsideredEqual(collectionOne, collectionTwo) {
    const collectionOneArray = Array.from(collectionOne);
    const collectionTwoArray = Array.from(collectionTwo);
    if (collectionOneArray.length !== collectionTwoArray.length) {
      return false;
    }
    for (let index = 0; index < collectionOne.length; index++) {
      const includedInOne = collectionOne.find(element =>
        this.#areConsideredEqual(element, collectionTwoArray[index]));
      const includedInTwo = collectionTwo.find(element =>
        this.#areConsideredEqual(element, collectionOneArray[index]));
      if (!includedInOne || !includedInTwo) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Assertion;
