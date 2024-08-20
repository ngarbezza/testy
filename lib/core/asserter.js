/*eslint max-lines: 'off'*/

import { TestResult } from './test_result.js';
import { TestResultReporter } from './test_result_reporter.js';
import { Assertion } from './assertion.js';
import { isStringWithContent } from '../utils.js';
import { I18nMessage } from '../i18n/i18n_messages.js';

/**
 * I report failures to the [test runner]{@link TestRunner}. The type of failures I report are not from failed
 * assertions, but user explicit requests for failures.
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
   * @example using the {@link isEqualTo} assertion
   * assert.that(3 + 4).isEqualTo(7)
   *
   * @example using the {@link isEmpty} assertion
   * assert.that("").isEmpty()
   *
   * @example using the {@link isNearTo} assertion
   * assert.that(0.1 + 0.2).isNearTo(0.3)
   *
   * @param {*} actual ths object under test.
   * @returns {Assertion} sn object that you can use to build an assertion.
   */
  that(actual) {
    return new Assertion(this._runner, actual);
  }

  /**
   * Expects a given object to be strictly equal to `true`. Other "truthy" values according to Javascript rules
   * will be considered not true.
   *
   * This is a shortcut of the [that]{@link that} syntax followed by a [isTrue]{@link Assertion#isTrue} assertion.
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
    return this.that(actual).isTrue();
  }

  /**
   * Expects a given object to be strictly equal to `false`. Other "falsey" values according to Javascript rules
   * will be considered not true.
   *
   * This is a shortcut of the {@link that} syntax followed by a [isFalse]{@link Assertion#isFalse} assertion.
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
    return this.that(actual).isFalse();
  }

  /**
   * Expects the actual object to be strictly equal to `undefined`.
   * This is a shortcut of the {@link that} syntax followed by a [isUndefined]{@link Assertion#isUndefined} assertion.
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
    return this.that(actual).isUndefined();
  }

  /**
   * Expects the actual object to be not strictly equal to `undefined`.
   * This is a shortcut of the {@link that} syntax followed by a [isNotUndefined]{@link Assertion#isNotUndefined} assertion.
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
    return this.that(actual).isNotUndefined();
  }

  /**
   * Expects the actual object to be strictly equal to `null`.
   * This is a shortcut of the [that]{@link that} syntax followed by a [isNull]{@link Assertion#isNull} assertion.
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
    return this.that(actual).isNull();
  }

  /**
   * Expects the actual object to be different from `null`.
   * This is a shortcut of the [that]{@link that} syntax followed by a [isNotNull]{@link Assertion#isNotNull} assertion.
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
    return this.that(actual).isNotNull();
  }

  /**
   * Expects two given objects to be equal according to a default or custom criteria.
   * This is a shortcut of the [that]{@link that} syntax followed by a [isEqualTo]{@link isEqualTo} assertion.
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
    return this.that(actual).isEqualTo(expected, criteria);
  }

  /**
   * Expects two given objects to be not equal, according to a default or custom criteria.
   * This is a shortcut of the [that]{@link that} syntax followed by a [isNotEqualTo]{@link isNotEqualTo} assertion.
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
    return this.that(actual).isNotEqualTo(expected, criteria);
  }

  /**
   * Expects two given objects to be identical, that is, to share the same reference.
   * This is a shortcut of the [that]{@link that} syntax followed by a [isIdenticalTo]{@link isEqualTo} assertion.
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
    return this.that(actual).isIdenticalTo(expected);
  }

  areNotIdentical(actual, expected) {
    return this.that(actual).isNotIdenticalTo(expected);
  }

  /**
   * Expects a given object to be an empty collection (arrays, strings, sets and maps).
   * This is a shortcut of the [that]{@link that} syntax followed by a [isEmpty]{@link Assertion.isEmpty} assertion.
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
    return this.that(actual).isEmpty();
  }

  /**
   * Expects a given object to be a non-empty collection (arrays, strings, sets and maps).
   * This is a shortcut of the [that]{@link that} syntax followed by a [isNotEmpty]{@link Assertion.isNotEmpty} assertion.
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
    return this.that(actual).isNotEmpty();
  }

  /**
   * Expects a given string to match a given regexp.
   * This is a shortcut of the [that]{@link that} syntax followed by a [matches]{@link Assertion.matches} assertion.
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
    return this.that(actual).matches(regex);
  }
}

export { Asserter, FailureGenerator, PendingMarker };
