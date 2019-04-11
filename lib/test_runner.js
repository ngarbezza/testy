'use strict';

const Test = require('./test');
const TestSuite = require('./test_suite');

class TestRunner {
  constructor(callbacks) {
    this._suites = [];
    this._callbacks = callbacks;
  }
  
  currentSuite() { return this._currentSuite; }
  suites() { return this._suites; }
  setCurrentSuite(suite) { this._currentSuite = suite; }
  registerSuite(name, suiteBody, callbacks) {
    let suite = new TestSuite(name, suiteBody, callbacks);
    this.suites().push(suite);
    this.setCurrentSuite(suite);
    return suite;
  }
  registerTest(name, testBody, callbacks) {
    let testToAdd = new Test(name, testBody, callbacks);
    this.currentSuite().addTest(testToAdd);
  }
  registerBefore(beforeBlock) {
    this.currentSuite().before(beforeBlock);
  }
  run() {
    this.suites().forEach(suite => {
      this.setCurrentSuite(suite);
      suite.run();
    });
    this._callbacks.onFinish(this);
  }
  
  setResultForCurrentTest(result) { this.currentSuite().currentTest().setResult(result); }
  successCount() { return this._aggregateResultsBy('successCount'); }
  pendingCount() { return this._aggregateResultsBy('pendingCount'); }
  errorsCount() { return this._aggregateResultsBy('errorsCount'); }
  failuresCount() { return this._aggregateResultsBy('failuresCount'); }
  totalCount() { return this._aggregateResultsBy('totalCount'); }
  
  finish(callbacks) {
    return this._considerResultAsSucceeded() ? callbacks.success() : callbacks.failure();
  }
  
  _considerResultAsSucceeded() {
    return this.errorsCount() + this.failuresCount() === 0;
  }
  
  _aggregateResultsBy(property) {
    return this.suites().reduce((count, suite) => count + suite[property](), 0);
  }
}

module.exports = TestRunner;
