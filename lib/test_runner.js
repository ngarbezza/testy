'use strict';

const Test = require('./test');
const TestSuite = require('./test_suite');
const FailFast = require('./fail_fast');
const { I18n } = require('./i18n');
const { shuffle } = require('./utils');

class TestRunner {
  constructor(callbacks) {
    this._suites = [];
    this._callbacks = callbacks;
    this.useLanguage(I18n.defaultLanguage());
    this.setFailFastMode(FailFast.default());
  }
  
  // Configuration
  
  registerSuite(name, suiteBody, callbacks) {
    const suiteToAdd = new TestSuite(name, suiteBody, callbacks);
    return this.addSuite(suiteToAdd);
  }
  
  registerTest(name, testBody, callbacks) {
    const testToAdd = new Test(name, testBody, callbacks);
    this._currentSuite.addTest(testToAdd);
  }
  
  registerBefore(beforeBlock) {
    this._currentSuite.before(beforeBlock);
  }
  
  registerAfter(afterBlock) {
    this._currentSuite.after(afterBlock);
  }

  addSuite(suiteToAdd) {
    this._suites.push(suiteToAdd);
    this._setCurrentSuite(suiteToAdd);
    return suiteToAdd;
  }
  
  useLanguage(language) {
    this._i18n = new I18n(language);
  }
  
  setFailFastMode(failFastMode) {
    this._failFastMode = failFastMode;
  }
  
  setTestRandomness(randomnessEnabled) {
    this._randomOrder = randomnessEnabled;
  }
  
  // Executing
  
  run() {
    this._randomizeSuites();
    this._suites.forEach(suite => {
      this._setCurrentSuite(suite);
      suite.run(this._executionContext());
    });
    this._callbacks.onFinish(this);
  }
  
  _executionContext() {
    return {
      failFastMode: this._failFastMode,
      randomOrderMode: this._randomOrder,
    };
  }
  
  setResultForCurrentTest(result) {
    this._currentSuite.currentTest().setResult(result);
  }
  
  finish() {
    if (this.hasErrorsOrFailures()) {
      return this._callbacks.onFailure(this);
    } else {
      return this._callbacks.onSuccess(this);
    }
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
  
  allFailuresAndErrors() {
    return this._suites.reduce((failures, suite) =>
      failures.concat(suite.allFailuresAndErrors()), [],
    );
  }
  
  hasErrorsOrFailures() {
    return this.allFailuresAndErrors().length > 0;
  }
  
  // Private
  
  _setCurrentSuite(suite) {
    this._currentSuite = suite;
  }
  
  _countEach(property) {
    return this._suites.reduce((count, suite) =>
      count + suite[property](), 0,
    );
  }
  
  _randomizeSuites() {
    if (this._randomOrder) {
      shuffle(this._suites);
    }
  }
}

module.exports = TestRunner;
