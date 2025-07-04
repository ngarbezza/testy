/*eslint max-lines: 'off'*/

import { TestResultReporter } from './test_result_reporter.js';
import { EqualityAssertionStrategy } from './equality_assertion_strategy.js';
import { IdentityAssertionStrategy } from './identity_assertion_strategy.js';
import { I18nMessage } from '../i18n/i18n_messages.js';
import { InvalidAssertionError } from '../errors.js';
import {
  asFloat,
  classNameOf,
  convertToArray,
  isFunction,
  isNumber,
  isRegex,
  isUndefined,
  notNullOrUndefined,
  numberOfElements,
  prettyPrint,
} from '../utils/index.js';

/**
 * I represent an assertion we want to make on a specific object (called the `actual`), against an expectation, in the
 * context of a {@link TestRunner}.
 *
 * I have multiple ways to write expectations, represented by my public instance methods.
 *
 * When the expectation is evaluated, it reports the results to the {@link TestRunner}.
 */
export class Assertion extends TestResultReporter {
  #actual;
  #customDescription;

  constructor(runner, actual, customDescription) {
    super(runner);
    this.#actual = actual;
    this.#customDescription = customDescription;
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
    this.#reportAssertionResult(
      this.#actual === true,
      () => I18nMessage.of('expectation_be_true', this.#actualResultAsString()),
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
    this.#reportAssertionResult(
      this.#actual === false,
      () => I18nMessage.of('expectation_be_false', this.#actualResultAsString()),
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
    this.#reportAssertionResult(
      isUndefined(this.#actual),
      () => I18nMessage.of('expectation_be_undefined', this.#actualResultAsString()),
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
    this.#reportAssertionResult(
      !isUndefined(this.#actual),
      () => I18nMessage.of('expectation_be_defined', this.#actualResultAsString()),
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
    this.#reportAssertionResult(
      this.#actual === null,
      () => I18nMessage.of('expectation_be_null', this.#actualResultAsString()),
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
    this.#reportAssertionResult(
      this.#actual !== null,
      () => I18nMessage.of('expectation_be_not_null', this.#actualResultAsString()),
    );
  }

  // Equality assertions

  /**
   * Expects the actual object to be equal to an expected object, according to a default or custom criteria.
   * Another way of writing this assertion is to use the {@link Asserter#areEqual} method.
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
    this.#equalityAssertion(expected, criteria, true);
  }

  /**
   * Expects the actual object to be not equal to an expected object, according to a default or custom criteria.
   * Another way of writing this assertion is to use the {@link Asserter#areNotEqual} method.
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
    this.#equalityAssertion(expected, criteria, false);
  }

  // Identity assertions

  /**
   * Expects the actual object to be identical (be the same reference) to an expected one.
   * Another way of writing this assertion is to use the {@link Asserter#areIdentical} method.
   *
   * @example literals
   * assert.that(3).isIdenticalTo(3)
   *
   * @example equivalent version
   * assert.areIdentical(3, 3)
   *
   * @example same reference
   * const object = { my: "object" }
   * assert.that(object).isIdenticalTo(object)
   *
   * @param {*} expected the object that you are expecting the `actual` to be.
   *
   * @returns {void}
   */
  isIdenticalTo(expected) {
    this.#identityAssertion(expected, true);
  }

  /**
   * Expects the actual object to be not identical (not be the same reference) to an expected one.
   * Another way of writing this assertion is to use the {@link Asserter#areNotIdentical} method.
   *
   * @example literals
   * assert.that(3).isNotIdenticalTo('3')
   *
   * @example equivalent version
   * assert.areNotIdentical(3, '3')
   *
   * @example different references
   * const object1 = { my: "object" }
   * const object2 = { my: "object" }
   * assert.that(object1).isNotIdenticalTo(object2)
   *
   * @param {*} expected the object that you are expecting the `actual` to not be identical to.
   *
   * @returns {void}
   */
  isNotIdenticalTo(expected) {
    this.#identityAssertion(expected, false);
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
    const resultIsSuccessful = convertToArray(this.#actual).find(element =>
      this.#areConsideredEqual(element, expectedObject, equalityCriteria));
    const failureMessage = () => I18nMessage.of('expectation_include', this.#actualResultAsString(), prettyPrint(expectedObject));
    this.#reportAssertionResult(resultIsSuccessful, failureMessage);
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
   * @param {Array|Set|Map|String} expectedCollection the collection that you are expecting the `actual` to be included in.
   * @param {Function} [equalityCriteria] a two-argument function to be used to compare elements from the
   * `expectedCollection` and your `actual` object. Optional.
   *
   * @returns {void}
   */
  isIncludedIn(expectedCollection, equalityCriteria) {
    const resultIsSuccessful = expectedCollection.find(element =>
      this.#areConsideredEqual(element, this.#actual, equalityCriteria));
    const failureMessage = () => I18nMessage.of('expectation_be_included_in', this.#actualResultAsString(), prettyPrint(expectedCollection));
    this.#reportAssertionResult(resultIsSuccessful, failureMessage);
  }

  /**
   * Expects the actual collection object to not include an expected object. Works for Array, Strings, Set and Maps.
   * It works in the same way as {@link includes} but negating the result.
   *
   * @example array
   * assert.that([1, 2, 3]).doesNotInclude(4)
   *
   * @example set
   * assert.that(new Set([1, 2, 3])).doesNotInclude(4)
   *
   * @example string
   * assert.that('42').doesNotInclude('5')
   *
   * @param {*} expectedObject the object that you are expecting to not be included.
   * @param {Function} [equalityCriteria] a two-argument function to be used to compare elements from the `actual`
   * collection and `expectedObject`. Optional.
   *
   * @returns {void}
   */
  doesNotInclude(expectedObject, equalityCriteria) {
    const resultIsSuccessful = !convertToArray(this.#actual).find(element =>
      this.#areConsideredEqual(element, expectedObject, equalityCriteria));
    const failureMessage = () => I18nMessage.of('expectation_not_include', this.#actualResultAsString(), prettyPrint(expectedObject));
    this.#reportAssertionResult(resultIsSuccessful, failureMessage);
  }

  /**
   * Expects the actual object to not be included in an expected collection. Works for Array, Strings, Set and Maps.
   * It works in the same way as {@link doesNotInclude} but swapping actual and expected objects.
   *
   * @example array
   * assert.that(4).isNotIncludedIn([1, 2, 3])
   *
   * @example set
   * assert.that(4).isNotIncludedIn(new Set([1, 2, 3]))
   *
   * @example string
   * assert.that('x').isNotIncludedIn('hello')
   *
   * @param {*} expectedCollection the collection that you are expecting the `actual` to not be included in.
   * @param {Function} [equalityCriteria] a two-argument function to be used to compare elements from the
   * `expectedCollection` and your `actual` object. Optional.
   *
   * @returns {void}
   */
  isNotIncludedIn(expectedCollection, equalityCriteria) {
    const resultIsSuccessful = !expectedCollection.find(element =>
      this.#areConsideredEqual(element, this.#actual, equalityCriteria));
    const failureMessage = () => I18nMessage.of('expectation_be_not_included_in', this.#actualResultAsString(), prettyPrint(expectedCollection));
    this.#reportAssertionResult(resultIsSuccessful, failureMessage);
  }

  /**
   * Expects the actual collection object to include exactly the same elements as the given ones, in any order.
   * The comparison is done using the default equality criteria.
   *
   * @example
   * assert.that([1, 2, 3]).includesExactly(2, 1, 3)
   * assert.that(new Set([1, 2, 3])).includesExactly(3, 1, 2)
   *
   * @param {...*} objects the objects that you are expecting to be included in the actual collection.
   * @returns {void}
   */
  includesExactly(...objects) {
    const resultIsSuccessful = this.#haveElementsConsideredEqual(this.#actual, objects);
    const failureMessage = () => I18nMessage.of('expectation_include_exactly', this.#actualResultAsString(), prettyPrint(objects));
    this.#reportAssertionResult(resultIsSuccessful, failureMessage);
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
    const resultIsSuccessful = numberOfElements(this.#actual || {}) === 0 && notNullOrUndefined(this.#actual);
    const failureMessage = () => I18nMessage.of('expectation_be_empty', this.#actualResultAsString());
    this.#reportAssertionResult(resultIsSuccessful, failureMessage);
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
    const setValueWhenUndefined = this.#actual || {};
    const resultIsSuccessful = numberOfElements(setValueWhenUndefined) > 0;
    const failureMessage = () => I18nMessage.of('expectation_be_not_empty', this.#actualResultAsString());
    this.#reportAssertionResult(resultIsSuccessful, failureMessage);
  }

  // Exception assertions

  /**
   * Expects the actual object (in this case, a function) to raise an exception that matches the given expectation.
   *
   * @example exact error object
   * assert.that(() => throw new Error("oops")).raises(new Error("oops"))
   *
   * @example regular expression
   * assert.that(() => throw new Error("oops I did it again")).raises(/oops/)
   *
   * @param {any|RegExp} errorExpectation the error object expected to be thrown or a Regex that matches with the actual error message.
   *
   * @returns {void}
   */
  raises(errorExpectation) {
    this.#ensureActualObjectIsAFunction();
    try {
      this.#evaluateActualObjectAsFunction();
      this.reportFailure(I18nMessage.of('expectation_error', prettyPrint(errorExpectation)));
    } catch (actualError) {
      const assertionPassed = this.#checkIfErrorMatchesExpectation(errorExpectation, actualError);
      const errorMessage = () =>
        I18nMessage.of(
          'expectation_different_error',
          prettyPrint(errorExpectation),
          classNameOf(errorExpectation),
          prettyPrint(actualError),
          classNameOf(actualError),
        );
      this.#reportAssertionResult(assertionPassed, errorMessage);
    }
  }

  /**
   * Expects the actual object (in this case, a function) to not raise an exception that matches the given criteria.
   *
   * @example exact error object
   * assert.that(() => throw new Error("oops")).doesNotRaise(new Error("ay!"))
   *
   * @example regular expression
   * assert.that(() => throw new Error("oops")).doesNotRaise(/ay/)
   *
   * @param {any|RegExp} notExpectedError the error object expected not to be thrown or a Regex that should not match
   * with the actual error message.
   *
   * @returns {void}
   */
  doesNotRaise(notExpectedError) {
    this.#ensureActualObjectIsAFunction();
    try {
      this.#evaluateActualObjectAsFunction();
      this.reportSuccess();
    } catch (actualError) {
      const errorCheck = this.#checkIfErrorMatchesExpectation(notExpectedError, actualError);
      const failureMessage = () => I18nMessage.of('expectation_no_error', prettyPrint(actualError));
      this.#reportAssertionResult(!errorCheck, failureMessage);
    }
  }

  /**
   * Expects the actual object (in this case, a function) to not raise any exception at all.
   * This is the most accurate way to ensure that a piece of code does not fail.
   *
   * @example
   * assert.that(() => 42).doesNotRaiseAnyErrors()
   *
   * @returns {void}
   */
  doesNotRaiseAnyErrors() {
    this.#ensureActualObjectIsAFunction();
    try {
      this.#evaluateActualObjectAsFunction();
      this.reportSuccess();
    } catch (error) {
      this.reportFailure(I18nMessage.of('expectation_no_errors', prettyPrint(error)));
    }
  }

  // Numeric assertions

  /**
   * Expects the actual object (in this case, a number) to be near to the expected one,
   * considering a certain precision of decimal digits.
   *
   * @example
   * assert.that(3.14159).isNearTo(3.1416, 4)
   *
   * @param {Number} number number to compare against the actual value
   * @param {Number} [precisionDigits=4] number of decimal digits to consider in the comparison. Optional, defaults to 4.
   *
   * @returns {void}
   */
  isNearTo(number, precisionDigits = 4) {
    const result = asFloat(this.#actual.toFixed(precisionDigits)) === number;
    const failureMessage = () => I18nMessage.of('expectation_be_near_to', this.#actualResultAsString(), number.toString(), precisionDigits.toString());
    this.#reportAssertionResult(result, failureMessage);
  }

  /**
   * Expects the actual object (in this case, a number) to be strictly greater than the given one.
   *
   * @example
   * assert.that(4).isGreaterThan(3)
   *
   * @param {Number} number number to compare against the actual value.
   * @returns {void}
   */
  isGreaterThan(number) {
    const comparator = (number1, number2) => number1 > number2;
    this.#runNumericalComparisonAssertion(number, comparator, 'expectation_be_greater_than');
  }

  /**
   * Expects the actual object (in this case, a number) to be greater or equal than the given one.
   *
   * @example
   * assert.that(4).isGreaterThanOrEqualTo(4)
   *
   * @param {Number} number number to compare against the actual value.
   * @returns {void}
   */
  isGreaterThanOrEqualTo(number) {
    const comparator = (number1, number2) => number1 >= number2;
    this.#runNumericalComparisonAssertion(number, comparator, 'expectation_be_greater_than_or_equal');
  }

  /**
   * Expects the actual object (in this case, a number) to be strictly less than the given one.
   *
   * @example
   * assert.that(3).isLessThan(4)
   *
   * @param {Number} number number to compare against the actual value.
   * @returns {void}
   */
  isLessThan(number) {
    const comparator = (number1, number2) => number1 < number2;
    this.#runNumericalComparisonAssertion(number, comparator, 'expectation_be_less_than');
  }

  /**
   * Expects the actual object (in this case, a number) to be less or equal than the given one.
   *
   * @example
   * assert.that(4).isLessThanOrEqualTo(4)
   *
   * @param {Number} number number to compare against the actual value.
   * @returns {void}
   */
  isLessThanOrEqualTo(number) {
    const comparator = (number1, number2) => number1 <= number2;
    this.#runNumericalComparisonAssertion(number, comparator, 'expectation_be_less_than_or_equal');
  }

  // String assertions

  /**
   * Expects the actual object (in this case, a string) to match the given regular expression.
   *
   * @example
   * assert.that("hello world").matches(/hello/)
   *
   * @example equivalent version
   * assert.isMatching('hello', /[a-z]+/)
   *
   * @param {RegExp} regex the regular expression to match against the actual value.
   * @returns {void}
   */
  matches(regex) {
    const result = this.#actual.match(regex);
    const failureMessage = () => I18nMessage.of('expectation_match_regex', this.#actualResultAsString(), regex);
    this.#reportAssertionResult(result, failureMessage);
  }

  // Private

  #identityAssertion(expected, shouldBeIdentical) {
    const {
      comparisonResult,
      overrideFailureMessage,
    } =
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
    const {
      comparisonResult,
      additionalFailureMessage,
      overrideFailureMessage,
    } =
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
      this.reportFailure(this.#customDescription || failureMessage.call());
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
    for (let index = 0; index < collectionOne.length; index += 1) {
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

  #ensureActualObjectIsAFunction() {
    if (!isFunction(this.#actual)) {
      throw new InvalidAssertionError(I18nMessage.of('invalid_actual_object_in_exception_assertion', this.#actualResultAsString()));
    }
  }

  #evaluateActualObjectAsFunction() {
    this.#actual.call();
  }

  #runNumericalComparisonAssertion(number, comparator, errorMessage) {
    this.#validateNumericalComparison(number);
    const number1 = asFloat(this.#actual);
    const number2 = asFloat(number);
    const result = comparator(number1, number2);
    const failureMessage = () => I18nMessage.of(errorMessage, number1.toString(), number2.toString());
    this.#reportAssertionResult(result, failureMessage);
  }

  #validateNumericalComparison(number) {
    if (!isNumber(this.#actual)) {
      throw new InvalidAssertionError(I18nMessage.of('invalid_actual_object_in_numerical_comparison', this.#actualResultAsString(), typeof this.#actual));
    }
    if (!isNumber(number)) {
      throw new InvalidAssertionError(I18nMessage.of('invalid_object_in_numerical_comparison', number, typeof number));
    }
  }
}
