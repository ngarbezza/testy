'use strict';

class TestSuite {
  constructor(name, body, callbacks) {
    this._name = name;
    this._body = body;
    this._tests = [];
    this._callbacks = callbacks;
    this._before = () => { return {}; };
  }
  
  // initializing / configuring
  addTest(test) { this._tests.push(test); }
  before(initialization) { this._before = initialization; }
  
  // executing
  run() {
    this.evaluateSuiteDefinition();
    this.runTests();
    this._callbacks.onFinish(this);
  }
  
  evaluateSuiteDefinition() { this._body.call(); }
  runTests() {
    this._tests.forEach(test => {
      this._currentTest = test;
      this._before.call();
      test.run();
    });
  }
  
  // counting
  totalCount() { return this._tests.length; }
  
  successCount() {
    return this._tests.filter(test => test.isSuccess()).length;
  }
  
  pendingCount() {
    return this._tests.filter(test => test.isPending()).length;
  }
  
  errorsCount() {
    return this._tests.filter(test => test.isError()).length;
  }
  
  failuresCount() {
    return this.totalCount() - this.successCount() - this.pendingCount() - this.errorsCount();
  }
  
  // accessing
  name() { return this._name; }
  currentTest() { return this._currentTest; }
}

module.exports = TestSuite;
