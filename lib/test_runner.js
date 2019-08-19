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
  
  // Configuration
  
  registerSuite(name, suiteBody = () => {}, callbacks = {}) {
    let suiteToAdd = new TestSuite(name, suiteBody, callbacks);
    this.suites().push(suiteToAdd);
    this._setCurrentSuite(suiteToAdd);
    return suiteToAdd;
  }
  
  registerTest(name, testBody, callbacks) {
    let testToAdd = new Test(name, testBody, callbacks);
    this.currentSuite().addTest(testToAdd);
  }
  
  registerBefore(beforeBlock) {
    this.currentSuite().before(beforeBlock);
  }
  
  useLanguage(language) {
    this._i18n = new I18n(language);
  }
  
  setFailFastMode(failFastMode) {
    this._failFastMode = failFastMode;
  }
  
  // Executing
  
  run() {
    this.suites().forEach(suite => {
      this._setCurrentSuite(suite);
      suite.run(this._failFastMode);
    });
    this._callbacks.onFinish(this);
  }
  
  setResultForCurrentTest(result) {
    this.currentSuite().currentTest().setResult(result);
  }
  
  finish(callbacks) {
    return this._considerResultAsSucceeded()
      ? callbacks.success()
      : callbacks.failure();
  }
  
  // Counting
  
  successCount() {
    return this._countEach('successCount');
  }
  
  pendingCount() {
    return this._countEach('pendingCount');
  }
  
  errorsCount() {
    return this._countEach('errorsCount');
  }
  
  failuresCount() {
    return this._countEach('failuresCount');
  }
  
  skippedCount() {
    return this._countEach('skippedCount');
  }
  
  totalCount() {
    return this._countEach('totalCount');
  }
  
  // Accessing
  
  currentSuite() {
    return this._currentSuite;
  }
  
  suites() {
    return this._suites;
  }
  
  // Private
  
  _setCurrentSuite(suite) {
    this._currentSuite = suite;
  }
  
  _considerResultAsSucceeded() {
    return this.errorsCount() + this.failuresCount() === 0;
  }
  
  _countEach(property) {
    return this.suites().reduce((count, suite) => count + suite[property](), 0);
  }
}

module.exports = TestRunner;
