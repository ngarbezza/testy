'use strict';

import { TestResultReporter } from './test_result_reporter.js';
import { EqualityAssertionStrategy } from './equality_assertion_strategy.js';
import { IdentityAssertionStrategy } from './identity_assertion_strategy.js';
import { I18nMessage } from '../i18n/i18n.js';
import { convertToArray, isRegex, isUndefined, notNullOrUndefined, numberOfElements, prettyPrint } from '../utils.js';

/**
 * I represent an assertion we want to make on a specific object (called the `actual`), against an expectation, in the
 * context of a {@link TestRunner}.
 *
 * I have multiple ways to write expectations, represented by my public instance methods.
 *
 * When the expectation is evaluated, it reports the results to the {@link TestRunner}.
 */
export class Assertion extends TestResultReporter {
  constructor(runner, actual) {
    super(runner);
    this._actual = actual;
  }

  // Boolean assertions

  /**
   * Expects the actual object to be strictly equal to `true`. Other "truthy" values according to Javascript rules
   * will be considered not true.
   * Another way of writing this assertion is to use the [isTrue]{@link Asserter#isTrue} method.
   *
   * @example
   * assert.that(3 < 4).isTrue()
   *
   * @example equivalent version
   * assert.isTrue(3 < 4)
   *
   * @returns {void}
   */
  isTrue() {
    this._reportAssertionResult(
      this._actual === true,
      () => I18nMessage.of('expectation_be_true', this._actualResultAsString()),
    );
  }

  /**
   * Expects the actual object to be strictly equal to `false`. Other "falsy" values according to Javascript rules
   * will be considered not false.
   * Another way of writing this assertion is to use the [isFalse]{@link Asserter#isFalse} method.
   *
   * @example
   * assert.that(3 >= 4).isFalse()
   *
   * @example equivalent version
   * assert.isFalse(3 >= 4)
   *
   * @returns {void}
   */
  isFalse() {
    this._reportAssertionResult(
      this._actual === false,
      () => I18nMessage.of('expectation_be_false', this._actualResultAsString()),
    );
  }

  // Undefined value assertions

  /**
   * Expects the actual object to be strictly equal to `undefined`.
   * Another way of writing this assertion is to use the [isUndefined]{@link Asserter#isUndefined} method.
   *
   * @example
   * assert.that(object.missingProperty).isUndefined()
   *
   * @example equivalent version
   * assert.isUndefined(object.missingProperty)
   *
   * @returns {void}
   */
  isUndefined() {
    this._reportAssertionResult(
      isUndefined(this._actual),
      () => I18nMessage.of('expectation_be_undefined', this._actualResultAsString()),
    );
  }

  /**
   * Expects the actual object to be not strictly equal to `undefined`.
   * Another way of writing this assertion is to use the [isNotUndefined]{@link Asserter#isNotUndefined} method.
   *
   * @example
   * assert.that("hello".length).isNotUndefined()
   *
   * @example equivalent version
   * assert.isNotUndefined("hello".length)
   *
   * @returns {void}
   */
  isNotUndefined() {
    this._reportAssertionResult(
      !isUndefined(this._actual),
      () => I18nMessage.of('expectation_be_defined', this._actualResultAsString()),
    );
  }

  // Null value assertions

  /**
   * Expects the actual object to be strictly equal to `null`.
   * Another way of writing this assertion is to use the [isNull]{@link Asserter#isNull} method.
   *
   * @example
   * assert.that(null).isNull()
   *
   * @example equivalent version
   * assert.isNull(null)
   *
   * @returns {void}
   */
  isNull() {
    this._reportAssertionResult(
      this._actual === null,
      () => I18nMessage.of('expectation_be_null', this._actualResultAsString()),
    );
  }

  /**
   * Expects the actual object to be different from `null`.
   * Another way of writing this assertion is to use the [isNotNull]{@link Asserter#isNotNull} method.
   *
   * @example
   * assert.that('something').isNotNull()
   *
   * @example equivalent version
   * assert.isNotNull('something')
   *
   * @returns {void}
   */
  isNotNull() {
    this._reportAssertionResult(
      this._actual !== null,
      () => I18nMessage.of('expectation_be_not_null', this._actualResultAsString()),
    );
  }

  // Equality assertions

  /**
   * Expects the actual object to be equal to an expected object, according to a default or custom criteria.
   * Another way of writing this assertion is to use the {@link areEqual} method.
   *
   * @example
   * assert.that('3' + '4').isEqualTo('34')
   *
   * @example equivalent version
   * assert.areEqual(3 + 4, 7)
   *
   * @example custom criteria
   * assert.that([2, 3]).isEqualTo(['x', 'y'], (a, b) => a.length === b.length)
   *
   * @param {*} expected the object that you are expecting the `actual` to be.
   * @param {Function} [criteria] a two-argument function to be used to compare `actual` and `expected`. Optional.
   *
   * @returns {void}
   */
  isEqualTo(expected, criteria) {
    this._equalityAssertion(expected, criteria, true);
  }

  /**
   * Expects the actual object to be not equal to an expected object, according to a default or custom criteria.
   * Another way of writing this assertion is to use the {@link areNotEqual} method.
   *
   * @example
   * assert.that('3' + '4').isNotEqualTo('7')
   *
   * @example equivalent version
   * assert.areNotEqual(3 + 4, 8)
   *
   * @example custom criteria
   * assert.that([2, 3]).isNotEqualTo(['x'], (a, b) => a.length === b.length)
   *
   * @param {*} expected the object that you are expecting the `actual` to be not equal.
   * @param {Function} [criteria] a two-argument function to be used to compare `actual` and `expected`. Optional.
   *
   * @returns {void}
   */
  isNotEqualTo(expected, criteria) {
    this._equalityAssertion(expected, criteria, false);
  }

  // Identity assertions

  isIdenticalTo(expected) {
    this._identityAssertion(expected, true);
  }

  isNotIdenticalTo(expected) {
    this._identityAssertion(expected, false);
  }

  // Collection assertions

  /**
   * Expects the actual collection object to include an expected object. Works for Array, Strings, Set and Maps.
   * It works in the same way as {@link isIncludedIn} but swapping actual and expected objects.
   *
   * @example array
   * assert.that([1, 2, 3]).includes(2)
   *
   * @example set
   * assert.that(new Set([1, 2, 3])).includes(3)
   *
   * @example string
   * assert.that('42').includes('4')
   *
   * @param {*} expectedObject the object that you are expecting to be included.
   * @param {Function} [equalityCriteria] a two-argument function to be used to compare elements from the `actual` collection and `expectedObject`. Optional.
   *
   * @returns {void}
   */
  includes(expectedObject, equalityCriteria) {
    const resultIsSuccessful = convertToArray(this._actual).find(element =>
      this._areConsideredEqual(element, expectedObject, equalityCriteria));
    const failureMessage = () => I18nMessage.of('expectation_include', this._actualResultAsString(), prettyPrint(expectedObject));
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }

  /**
   * Expects the actual object to be included on an expected collection. Works for Array, Strings, Set and Maps.
   * It works in the same way as {@link includes} but swapping actual and expected objects.
   *
   * @example array
   * assert.that(2).isIncludedIn([1, 2, 3])
   *
   * @example set
   * assert.that(3).isIncludedIn(new Set([1, 2, 3]))
   *
   * @example string
   * assert.that('lo').isIncludedIn('hello')
   *
   * @param {*} expectedCollection the collection that you are expecting the `actual` to be included in.
   * @param {Function} [equalityCriteria] a two-argument function to be used to compare elements from the `expectedCollection` and your `actual` object. Optional.
   *
   * @returns {void}
   */
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

  /**
   * Expects the actual object to be an empty collection (arrays, strings, sets and maps).
   * Another way of writing this assertion is to use the [isEmpty]{@link Asserter#isEmpty} method.
   *
   * @example
   * assert.that([]).isEmpty()
   * assert.that('').isEmpty()
   * assert.that(new Set()).isEmpty()
   * assert.that(new Map()).isEmpty()
   *
   * @example equivalent version
   * assert.isEmpty('')
   *
   * @returns {void}
   */
  isEmpty() {
    const resultIsSuccessful = numberOfElements(this._actual || {}) === 0 && notNullOrUndefined(this._actual);
    const failureMessage = () => I18nMessage.of('expectation_be_empty', this._actualResultAsString());
    this._reportAssertionResult(resultIsSuccessful, failureMessage);
  }

  /**
   * Expects the actual object to be a non-empty collection (arrays, strings, sets and maps).
   * Another way of writing this assertion is to use the [isNotEmpty]{@link Asserter#isNotEmpty} method.
   *
   * @example
   * assert.that([42]).isNotEmpty()
   * assert.that('hello').isNotEmpty()
   * assert.that(new Set([42])).isNotEmpty()
   * assert.that(new Map([['key', 42]])).isNotEmpty()
   *
   * @example equivalent version
   * assert.isNotEmpty('hello')
   *
   * @returns {void}
   */
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
      this.reportSuccess();
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

  _identityAssertion(expected, shouldBeIdentical) {
    const { comparisonResult, overrideFailureMessage } =
      IdentityAssertionStrategy.evaluate(this._actual, expected);
    const resultIsSuccessful = shouldBeIdentical ? comparisonResult : !comparisonResult;

    if (isUndefined(comparisonResult)) {
      this._reportAssertionResult(false, overrideFailureMessage);
    } else {
      const expectationMessageKey = shouldBeIdentical ? 'identity_assertion_be_identical_to' : 'identity_assertion_be_not_identical_to';
      const expectationMessage = () => I18nMessage.of(expectationMessageKey, this._actualResultAsString(), prettyPrint(expected));
      this._reportAssertionResult(resultIsSuccessful, expectationMessage);
    }
  }

  _equalityAssertion(expected, criteria, shouldBeEqual) {
    const { comparisonResult, additionalFailureMessage, overrideFailureMessage } =
      EqualityAssertionStrategy.evaluate(this._actual, expected, criteria);
    const resultIsSuccessful = shouldBeEqual ? comparisonResult : !comparisonResult;

    if (isUndefined(comparisonResult)) {
      this._reportAssertionResult(false, overrideFailureMessage);
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
    for (let index = 0; index < collectionOne.length; index += 1) {
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
