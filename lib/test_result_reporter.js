'use strict';

const TestResult = require('./test_result');

class TestResultReporter {
  constructor(runner) {
    this._runner = runner;
  }

  report(result) {
    this._runner.setResultForCurrentTest(result);
  }

  reportSuccess() {
    return this.report(TestResult.success());
  }

  reportFailure(message) {
    return this.report(TestResult.failure(message));
  }
}

module.exports = TestResultReporter;
