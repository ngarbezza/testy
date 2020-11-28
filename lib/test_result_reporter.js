'use strict';

class TestResultReporter {
  constructor(runner) {
    this._runner = runner;
  }
  
  report(result) {
    this._runner.setResultForCurrentTest(result);
  }
  
  translated(key) {
    return this._runner._i18n.translate(key);
  }
}

module.exports = TestResultReporter;
