'use strict';

const FailFast = require('./fail_fast');
const { shuffle, isString, isFunction } = require('./utils');

class TestSuite {
  constructor(name, body, callbacks) {
    this._initializeName(name);
    this._initializeBody(body);
    this._tests = [];
    this._callbacks = callbacks;
    this._before = undefined;
  }
  
  // Initializing / Configuring
  
  addTest(test) {
    this._tests.push(test);
  }
  
  before(initialization) {
    if (this._before === undefined)
      this._before = initialization;
    else
      throw 'There is already a before() block. Please leave just one before() block and run again the tests.';
  }
  
  // Executing
  
  run(failFastMode = FailFast.default(), randomOrderMode = false) {
    this._callbacks.onStart(this);
    this._evaluateSuiteDefinition();
    this._runTests(failFastMode, randomOrderMode);
    this._callbacks.onFinish(this);
  }

  // Counting
  
  totalCount() {
    return this.tests().length;
  }
  
  successCount() {
    return this.tests().filter(test => test.isSuccess()).length;
  }
  
  pendingCount() {
    return this.tests().filter(test => test.isPending()).length;
  }
  
  errorsCount() {
    return this.tests().filter(test => test.isError()).length;
  }
  
  skippedCount() {
    return this.tests().filter(test => test.isSkipped()).length;
  }
  
  failuresCount() {
    return this.totalCount() - this.successCount() - this.pendingCount() - this.errorsCount() - this.skippedCount();
  }
  
  // Accessing
  
  name() {
    return this._name;
  }
  
  currentTest() {
    return this._currentTest;
  }
  
  tests() {
    return this._tests;
  }
  
  allFailuresAndErrors() {
    return this.tests().filter(test => test.isFailure() || test.isError());
  }
  
  // Private - Validations
  
  _initializeBody(body) {
    this._ensureBodyIsValid(body);
    this._body = body;
  }
  
  _initializeName(name) {
    this._ensureNameIsValid(name);
    this._name = name;
  }
  
  _ensureNameIsValid(name) {
    if (!isString(name)) {
      throw 'Suite does not have a valid name';
    }
  }
  
  _ensureBodyIsValid(body) {
    if (!isFunction(body)) {
      throw 'Suite does not have a valid body';
    }
  }
  
  // Private - Running
  
  _randomizeTests() {
    shuffle(this.tests());
  }
  
  _evaluateSuiteDefinition() {
    this._body.call();
  }
  
  _evaluateBeforeBlock() {
    this._before && this._before.call();
  }
  
  // TODO: reify configuration instead of many boolean flags
  _runTests(failFastMode, randomOrderMode) {
    if (randomOrderMode) {
      this._randomizeTests();
    }
    this.tests().forEach(test => {
      this._currentTest = test;
      this._evaluateBeforeBlock();
      test.run(failFastMode);
    });
  }
}

module.exports = TestSuite;
