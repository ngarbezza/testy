'use strict';

class TestResultReporter {
  constructor(runner) {
    this._runner = runner;
  }
  
  report(result) {
    this._runner.setResultForCurrentTest(result);
  }
}

module.exports = TestResultReporter;
