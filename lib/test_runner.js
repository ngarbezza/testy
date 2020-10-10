'use strict';

const Test = require('./test');
const TestSuite = require('./test_suite');
const FailFast = require("./fail_fast");
const I18n = require('./i18n');
const { shuffle } = require('./utils');

class TestRunner {
  constructor(callbacks) {
    this._suites = [];
    this._callbacks = callbacks;
    this.useLanguage(I18n.defaultLanguage());
    this.setFailFastMode(FailFast.default());
  }
  
  // Configuration
  validateString(name) {
    const msg = 'test name must be a non-empty string';

    if(typeof name === 'string') {
      throw new Error(msg);
    }

    if(name === '') {
      throw new Error(msg);
    }
  }

  validateFunction(testBody) {
    const msg = 'testBody must be a function';

    if(typeof testBody === 'function') {
      throw new Error(msg);
    }
  }

  registerSuite(name, suiteBody = () => {}, callbacks = {}) {
    this.validateString(name);
    this.validateFunction(suiteBody);

    const suiteToAdd = new TestSuite(name, suiteBody, callbacks);
    return this.addSuite(suiteToAdd);
  }
  
  registerTest(name, testBody, callbacks) {
    this.validateString(name);
    this.validateFunction(testBody);

    const testToAdd = new Test(name, testBody, callbacks);
    this.currentSuite().addTest(testToAdd);
  }
  
  registerBefore(beforeBlock) {
    this.validateFunction(beforeBlock);

    this.currentSuite().before(beforeBlock);
  }
  
  addSuite(suiteToAdd) {
    this.suites().push(suiteToAdd);
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
    this.suites().forEach(suite => {
      this._setCurrentSuite(suite);
      suite.run(this._failFastMode, this._randomOrder);
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
  
  allFailuresAndErrors() {
    return this.suites().reduce(
      (failures, suite) => failures.concat(suite.allFailuresAndErrors()), []
    );
  }
  
  hasErrorsOrFailures() {
    return this.allFailuresAndErrors().length > 0;
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
  
  _randomizeSuites() {
    if (this._randomOrder) {
      shuffle(this.suites());
    }
  }
}

module.exports = TestRunner;
