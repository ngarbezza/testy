'use strict';

const FailFast = require('./fail_fast');

class TestSuite {
  constructor(name, body, callbacks) {
    this._name = name;
    this._body = body;
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
  
  async run(failFastMode = FailFast.default()) {
    this._callbacks.onStart(this);
    this.evaluateSuiteDefinition();
    await this.runTests(failFastMode);
    this._callbacks.onFinish(this);
  }
  
  evaluateSuiteDefinition() {
    this._body.call();
  }
  
  evaluateBeforeBlock() {
    return this._before && this._before.call();
  }
  
  async runTests(failFastMode) {
    for (const test of this.tests()) {
      this._currentTest = test;
      await this.evaluateBeforeBlock();
      await test.run(failFastMode);
    }
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
    return this.tests().filter(test => test.isFailure() || test.isError())
  }
}

module.exports = TestSuite;
