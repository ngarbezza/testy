'use strict';

const { shuffle, isUndefined, isStringWithContent, isFunction } = require('./utils');

class TestSuite {
  constructor(name, body, callbacks) {
    this._initializeName(name);
    this._initializeBody(body);
    this._tests = [];
    this._callbacks = callbacks;
    this._before = undefined;
    this._after = undefined;
  }
  
  // Initializing / Configuring
  
  addTest(test) {
    this._tests.push(test);
  }
  
  before(initializationBlock) {
    if (isUndefined(this._before)) {
      this._before = initializationBlock;
    } else {
      throw new Error('There is already a before() block. Please leave just one before() block and run again the tests.');
    }
  }
  
  after(releasingBlock) {
    if (isUndefined(this._after)) {
      this._after = releasingBlock;
    } else {
      throw new Error('There is already an after() block. Please leave just one after() block and run again the tests.');
    }
  }

  // Executing
  
  run(context) {
    this._callbacks.onStart(this);
    this._evaluateSuiteDefinition();
    this._runTests(context);
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
    if (!isStringWithContent(name)) {
      throw new Error('Suite does not have a valid name');
    }
  }
  
  _ensureBodyIsValid(body) {
    if (!isFunction(body)) {
      throw new Error('Suite does not have a valid body');
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
  
  _evaluateAfterBlock() {
    this._after && this._after.call();
  }

  _runTests(context) {
    if (context.randomOrderMode) {
      this._randomizeTests();
    }
    this.tests().forEach(test => {
      this._currentTest = test;
      this._evaluateBeforeBlock();
      test.run(context);
      this._evaluateAfterBlock();
    });
  }
}

module.exports = TestSuite;
