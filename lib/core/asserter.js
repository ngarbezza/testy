/*eslint max-lines: 'off'*/

import { TestResult } from './test_result.js';
import { TestResultReporter } from './test_result_reporter.js';
import { Assertion } from './assertion.js';
import { isStringWithContent } from '../utils/index.js';
import { I18nMessage } from '../i18n/i18n_messages.js';

/**
 * I report failures to the [test runner]{@link TestRunner}. The type of failures I report are not from failed
 * assertions but user explicit requests for failures.
 */
class FailureGenerator extends TestResultReporter {
  /**
   * Makes the current test to explicitly fail, indicating an exceptional scenario.
   *
   * @example
   * fail.with('The code should not reach this point')
   *
   * @param {string} description A reason to explain why we are explicitly failing.
   * @returns {void}
   */
  with(description) {
    const messageToReport = description || I18nMessage.of('explicitly_failed');
    this.reportFailure(messageToReport);
  }
}

/**
 * I report pending tests to the [test runner]{@link TestRunner}. Those tests will be displayed as WIP.
 */
class PendingMarker extends TestResultReporter {
  /**
   * Indicates a test is not ready to be evaluated until the end to produce a final result, so it will be reported as a
   * [pending result]{@link TestResult.explicitlyMarkedAsPending}. If no reason is provided, an
   * [error result]{@link TestResult.error} will be reported instead.
   *
   * @param {!string} reason A required explanation to indicate why this test is not ready.
   * @returns {void}
   */
  dueTo(reason) {
    if (isStringWithContent(reason)) {
      this.report(TestResult.explicitlyMarkedAsPending(reason));
    } else {
      this.report(TestResult.error(this.#invalidReasonErrorMessage()));
    }
  }

  #invalidReasonErrorMessage() {
    return I18nMessage.of('invalid_pending_reason');
  }
}

/**
 * I am the entry point for generating different types of assertions and reporting their results to the
 * [test runner]{@link TestRunner}.
 */
class Asserter extends TestResultReporter {
  /**
   * Starts an assertion. A call to this method needs to be chained with an expectation, otherwise it does not
   * represent a valid assertion.
   *
   * @example using the {@link Assertion#isEqualTo} assertion
   * assert.that(3 + 4).isEqualTo(7)
   *
   * @example using the {@link Assertion#isEmpty} assertion
   * assert.that("").isEmpty()
   *
   * @example using the {@link Assertion#isNearTo} assertion
   * assert.that(0.1 + 0.2).isNearTo(0.3)
   *
   * @param {*} actual the object under test.
   * @returns {Assertion} an object that you can use to build an assertion.
   */
  that(actual) {
    return new Assertion(this._runner, actual, this.customDescription());
  }

  /**
   * Constructs an assertion overriding the default failure message. This is convenient when the assertion does
   * not provide enough context to understand what is happening.
   *
   * @example adding context to {@link Assertion#isTrue} assertion
   * assert.withDescription("Light was not turned on!").isTrue(light.isOn())
   *
   * @param {string} description the text you want to see when the assertion fails.
   * @returns {DescribedAsserter}
   */
  withDescription(description) {
    return new DescribedAsserter(this._runner, description);
  }

  customDescription() {
    return '';
  }

  /**
   * Expects a given object to be strictly equal to `true`.
   * Other "truthy" values, according to Javascript rules, will be considered not true.
   *
   * This is a shortcut of the [that]{@link Asserter#that} syntax followed by a [isTrue]{@link Assertion#isTrue} assertion.
   *
   * @example
   * assert.isTrue(3 < 4)
   *
   * @example equivalent version
   * assert.that(3 < 4).isTrue()
   *
   * @param {*} actual the object you expect to be `true`.
   * @returns {void}
   */
  isTrue(actual) {
    this.that(actual).isTrue();
  }

  /**
   * Expects a given object to be strictly equal to `false`.
   * Other "falsey" values, according to Javascript rules, will be considered not false.
   *
   * This is a shortcut of the {@link Asserter#that} syntax followed by a [isFalse]{@link Assertion#isFalse} assertion.
   *
   * @example
   * assert.isFalse(4 < 3)
   *
   * @example equivalent version
   * assert.that(4 < 3).isFalse()
   *
   * @param {*} actual the object you expect to be `false`.
   * @returns {void}
   */
  isFalse(actual) {
    this.that(actual).isFalse();
  }

  /**
   * Expects the actual object to be strictly equal to `undefined`.
   * This is a shortcut of the {@link Asserter#that} syntax followed by a [isUndefined]{@link Assertion#isUndefined} assertion.
   *
   * @example
   * assert.isUndefined(object.missingProperty)
   *
   * @example equivalent version
   * assert.that(object.missingProperty).isUndefined()
   *
   * @param {*} actual the object you expect to be `undefined`.
   * @returns {void}
   */
  isUndefined(actual) {
    this.that(actual).isUndefined();
  }

  /**
   * Expects the actual object to be not strictly equal to `undefined`.
   * This is a shortcut of the {@link Asserter#that} syntax followed by a [isNotUndefined]{@link Assertion#isNotUndefined} assertion.
   *
   * @example
   * assert.isNotUndefined("hello".length)
   *
   * @example equivalent version
   * assert.that("hello".length).isNotUndefined()
   *
   * @param {*} actual the object you expect to be not `undefined`.
   * @returns {void}
   */
  isNotUndefined(actual) {
    this.that(actual).isNotUndefined();
  }

  /**
   * Expects the actual object to be strictly equal to `null`.
   * This is a shortcut of the [that]{@link Asserter#that} syntax followed by a [isNull]{@link Assertion#isNull} assertion.
   *
   * @example
   * assert.isNull(null)
   *
   * @example equivalent version
   * assert.that(null).isNull()
   *
   * @param {*} actual the object you expect to be `null`.
   * @returns {void}
   */
  isNull(actual) {
    this.that(actual).isNull();
  }

  /**
   * Expects the actual object to be different from `null`.
   * This is a shortcut of the [that]{@link Asserter#that} syntax followed by a [isNotNull]{@link Assertion#isNotNull} assertion.
   *
   * @example
   * assert.isNotNull('something')
   *
   * @example equivalent version
   * assert.that('something').isNotNull()
   *
   * @param {*} actual the object you expect to be different from `null`.
   * @returns {void}
   */
  isNotNull(actual) {
    this.that(actual).isNotNull();
  }

  /**
   * Expects two given objects to be equal according to a default or custom criteria.
   * This is a shortcut of the [that]{@link Asserter#that} syntax followed by a [isEqualTo]{@link Assertion#isEqualTo} assertion.
   *
   * @example
   * assert.areEqual(3 + 4, 7)
   *
   * @example equivalent version
   * assert.that('3' + '4').isEqualTo('34')
   *
   * @example custom criteria
   * assert.areEqual([2, 3], ['x', 'y'], (a, b) => a.length === b.length)
   *
   * @param {*} actual the object under test.
   * @param {*} expected the object that you are expecting the `actual` to be.
   * @param {Function} [criteria] a two-argument function to be used to compare `actual` and `expected`. Optional.
   *
   * @returns {void}
   */
  areEqual(actual, expected, criteria) {
    this.that(actual).isEqualTo(expected, criteria);
  }

  /**
   * Expects two given objects to be not equal, according to a default or custom criteria.
   * This is a shortcut of the [that]{@link Asserter#that} syntax followed by a [isNotEqualTo]{@link Assertion#isNotEqualTo} assertion.
   *
   * @example
   * assert.areNotEqual(3 + 4, 8)
   *
   * @example equivalent version
   * assert.that('3' + '4').isNotEqualTo('7')
   *
   * @example custom criteria
   * assert.areNotEqual([2, 3], ['x'], (a, b) => a.length === b.length)
   *
   * @param {*} actual the object under test.
   * @param {*} expected the object that you are expecting the `actual` to not be equal.
   * @param {Function} [criteria] a two-argument function to be used to compare `actual` and `expected`. Optional.
   *
   * @returns {void}
   */
  areNotEqual(actual, expected, criteria) {
    this.that(actual).isNotEqualTo(expected, criteria);
  }

  /**
   * Expects two given objects to be identical, that is, to share the same reference.
   * This is a shortcut of the [that]{@link Asserter#that} syntax followed by a [isIdenticalTo]{@link Assertion#isEqualTo} assertion.
   *
   * @example literals
   * assert.areIdentical(3, 3)
   *
   * @example equivalent version
   * assert.that(3).isIdenticalTo(3)
   *
   * @example same reference
   * const object = { my: "object" }
   * assert.areIdentical(object, object)
   *
   * @param {*} actual the object under test.
   * @param {*} expected the object that you are expecting the `actual` to be.
   *
   * @returns {void}
   */
  areIdentical(actual, expected) {
    this.that(actual).isIdenticalTo(expected);
  }

  /**
   * Expects two given objects to be not identical, that is, to not share the same reference.
   * This is a shortcut of the [that]{@link Asserter#that} syntax followed by a [isNotIdenticalTo]{@link Assertion#isNotIdenticalTo} assertion.
   *
   * @example literals
   * assert.areNotIdentical(3, 3 + 0)
   *
   * @example equivalent version
   * assert.that(3).isNotIdenticalTo(3 + 0)
   *
   * @example different references
   * const object1 = { my: "object" }
   * const object2 = { my: "object" }
   * assert.areNotIdentical(object1, object2)
   *
   * @param {*} actual the object under test.
   * @param {*} expected the object that you are expecting the `actual` to not be identical to.
   *
   * @returns {void}
   */
  areNotIdentical(actual, expected) {
    this.that(actual).isNotIdenticalTo(expected);
  }

  /**
   * Expects a given object to be an empty collection (arrays, strings, sets and maps).
   * This is a shortcut of the [that]{@link Asserter#that} syntax followed by a [isEmpty]{@link Assertion#isEmpty} assertion.
   *
   * @example
   * assert.isEmpty([])
   * assert.isEmpty('')
   * assert.isEmpty(new Set())
   * assert.isEmpty(new Map())
   *
   * @example equivalent version
   * assert.that('').isEmpty()
   *
   * @param {*} actual the collection object you expect to be empty.
   *
   * @returns {void}
   */
  isEmpty(actual) {
    this.that(actual).isEmpty();
  }

  /**
   * Expects a given object to be a non-empty collection (arrays, strings, sets and maps).
   * This is a shortcut of the [that]{@link Asserter#that} syntax followed by a [isNotEmpty]{@link Assertion#isNotEmpty} assertion.
   *
   * @example
   * assert.isNotEmpty([42])
   * assert.isNotEmpty('hello')
   * assert.isNotEmpty(new Set([42]))
   * assert.isNotEmpty(new Map([['key', 42]]))
   *
   * @example equivalent version
   * assert.that('hello').isNotEmpty()
   *
   * @param {*} actual the collection object you expect to be non-empty.
   *
   * @returns {void}
   */
  isNotEmpty(actual) {
    this.that(actual).isNotEmpty();
  }

  /**
   * Expects a given string to match a given regexp.
   * This is a shortcut of the [that]{@link Asserter#that} syntax followed by a [matches]{@link Assertion#matches} assertion.
   *
   * @example
   * assert.isMatching('hello', /[a-z]+/)
   *
   * @example equivalent version
   * assert.that('hello').matches(/[a-z]+/)
   *
   * @param {String} actual the string you will check against the regex.
   * @param {RegExp} regex the regexp you will use to parse the actual string.
   *
   * @returns {void}
   */
  isMatching(actual, regex) {
    this.that(actual).matches(regex);
  }
}

/**
 * A special case of [asserter]{@link Asserter} that adds a custom message to the assertion,
 * that will be used as a failure message.
 * See {@link Asserter#withDescription} for more information on how to use this asserter.
 */
class DescribedAsserter extends Asserter {
  #description;

  constructor(runner, description) {
    super(runner);
    this.#description = description;
  }

  customDescription() {
    return this.#description;
  }
}

export { Asserter, FailureGenerator, PendingMarker };
