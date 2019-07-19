'use strict';

const Test = require('./test');
const TestSuite = require('./test_suite');
const FailFast = require("./fail_fast");
const I18n = require('./i18n');

class TestRunner {
  constructor(callbacks) {
    this._suites = [];
    this._callbacks = callbacks;
    this.useLanguage(I18n.defaultLanguage());
    this.setFailFastMode(FailFast.default());
  }
  
  // configuration
  setCurrentSuite(suite) { this._currentSuite = suite; }
  registerSuite(name, suiteBody = () => {}, callbacks = {}) {
    let suite = new TestSuite(name, suiteBody, callbacks);
    this.suites().push(suite);
    this.setCurrentSuite(suite);
    return suite;
  }
  registerTest(name, testBody, callbacks) {
    let testToAdd = new Test(name, testBody, callbacks);
    this.currentSuite().addTest(testToAdd);
  }
  registerBefore(beforeBlock) { this.currentSuite().before(beforeBlock); }
  useLanguage(language) { this._i18n = new I18n(language); }
  setFailFastMode(failFastMode) { this._failFastMode = failFastMode; }
  
  // accessing
  currentSuite() { return this._currentSuite; }
  suites() { return this._suites; }
  
  // executing
  run() {
    this.suites().forEach(suite => {
      this.setCurrentSuite(suite);
      suite.run(this._failFastMode);
    });
    this._callbacks.onFinish(this);
  }
  
  setResultForCurrentTest(result) { this.currentSuite().currentTest().setResult(result); }
  finish(callbacks) {
    return this._considerResultAsSucceeded() ? callbacks.success() : callbacks.failure();
  }
  
  // counting
  successCount() { return this._aggregateResultsBy('successCount'); }
  pendingCount() { return this._aggregateResultsBy('pendingCount'); }
  errorsCount() { return this._aggregateResultsBy('errorsCount'); }
  failuresCount() { return this._aggregateResultsBy('failuresCount'); }
  skippedCount() { return this._aggregateResultsBy('skippedCount'); }
  totalCount() { return this._aggregateResultsBy('totalCount'); }
  
  // private
  _considerResultAsSucceeded() { return this.errorsCount() + this.failuresCount() === 0; }
  _aggregateResultsBy(property) { return this.suites().reduce((count, suite) => count + suite[property](), 0); }
}

module.exports = TestRunner;
