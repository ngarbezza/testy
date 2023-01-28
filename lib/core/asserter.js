'use strict';

const TestResult = require('./test_result');
const TestResultReporter = require('./test_result_reporter');
const Assertion = require('./assertion');
const { I18nMessage } = require('../i18n/i18n');

const { isStringWithContent } = require('../utils');

class FailureGenerator extends TestResultReporter {
  /**
   * Makes the current test to explicitly fail, indicating an exceptional scenario.
   *
   * @example
   * fail.with('The code should not reach this point')
   *
   * @param {String} description A reason to explain why we are explicitly failing.
   * @returns {void}
   */
  with(description) {
    const messageToReport = description || I18nMessage.of('explicitly_failed');
    this.report(TestResult.failure(messageToReport));
  }
}

class PendingMarker extends TestResultReporter {
  /**
   * Indicates a test is not ready to be evaluated until the end to produce a final result, so it will be reported as a
   * [pending result]{@link TestResult.explicitlyMarkedAsPending}. If no reason is provided, an
   * [error result]{@link TestResult.error} will be reported instead.
   *
   * @param {String} reason A required explanation to indicate why this test is not ready.
   * @returns {void}
   */
  dueTo(reason) {
    if (isStringWithContent(reason)) {
      this.report(TestResult.explicitlyMarkedAsPending(reason));
    } else {
      this.report(TestResult.error(this.invalidReasonErrorMessage()));
    }
  }

  invalidReasonErrorMessage() {
    return I18nMessage.of('invalid_pending_reason');
  }
}

/**
 * I am the entry point for generating different types of assertions.
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
   * This is a shortcut of the {@link that} syntax followed by a [isTrue]{@link Assertion#isTrue} assertion.
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
   * This is a shortcut of the {@link that} syntax followed by a [isUndefined]{@link Assertion#isUndefined} assertion..
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

  isNotUndefined(actual) {
    return this.that(actual).isNotUndefined();
  }

  isNull(actual) {
    return this.that(actual).isNull();
  }

  isNotNull(actual) {
    return this.that(actual).isNotNull();
  }

  /**
   * Expects two given objects to be equal according to a default or custom criteria.
   * This is a shortcut of the {@link that} syntax followed by a {@link isEqualTo} assertion.
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
   * @param {Function} [criteria] s two-argument function to be used to compare `actual` and `expected`. Optional.
   *
   * @returns {void}
   */
  areEqual(actual, expected, criteria) {
    return this.that(actual).isEqualTo(expected, criteria);
  }

  /**
   * Expects two given objects to be not equal according to a default or custom criteria.
   * This is a shortcut of the {@link that} syntax followed by a {@link isNotEqualTo} assertion.
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
   * @param {Function} [criteria] s two-argument function to be used to compare `actual` and `expected`. Optional.
   *
   * @returns {void}
   */
  areNotEqual(actual, expected, criteria) {
    return this.that(actual).isNotEqualTo(expected, criteria);
  }

  areIdentical(actual, expected) {
    return this.that(actual).isIdenticalTo(expected);
  }

  areNotIdentical(actual, expected) {
    return this.that(actual).isNotIdenticalTo(expected);
  }

  /**
   * Expects a given object to be an empty collection (arrays, strings, sets and maps).
   * This is a shortcut of the {@link that} syntax followed by a {@link Assertion.isEmpty} assertion.
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

  isNotEmpty(actual) {
    return this.that(actual).isNotEmpty();
  }

  isMatching(actual, regex) {
    return this.that(actual).matches(regex);
  }
}

module.exports = { Asserter, FailureGenerator, PendingMarker };
