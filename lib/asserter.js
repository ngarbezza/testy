'use strict';

const TestResult = require('./test_result');
const TestResultReporter = require('./test_result_reporter');
const Assertion = require('./assertion');

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

  isMatching(actual, regex) {
    return this.that(actual).matches(regex);
  }
}

module.exports = { Asserter, FailureGenerator, PendingMarker };
