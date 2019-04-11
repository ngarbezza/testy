'use strict';

class TestResult {
  static evaluate(test) {
    return [TestWithoutDefinition, TestWithDefinition].
      find(result => result.canHandle(test)).
      handle(test);
  }
  
  isSuccess() { return false; }
  isPending() { return false; }
  isError() { return false; }
}

class TestWithoutDefinition extends TestResult {
  static canHandle(test) { return !test.hasDefinition(); }
  static handle(test) { test.markPending(new TestWithoutDefinition()); }
  
  isPending() { return true; }
}

class TestWithDefinition extends TestResult {
  static canHandle(test) { return test.hasDefinition(); }
  
  static handle(test) {
    test.evaluate();
    const possibleResults = [TestWithoutAssertion, TestErrored, TestSucceeded, TestFailed];
    possibleResults.find(result => result.canHandle(test)).handle(test);
  }
}

class TestErrored extends TestWithDefinition {
  static canHandle(test) { return test.isError(); }
  static handle(test) { test.finishWithError(); }
  
  constructor(error) {
    super();
    this._error = error;
  }
  
  isError() { return true; }
  failureMessage() { return this._error.stack || this._error; }
}

class TestWithoutAssertion extends TestErrored {
  static canHandle(test) { return test.hasNoResult(); }
  static handle(test) {
    test.setResult(new TestWithoutAssertion());
    super.handle(test);
  }
  
  constructor() {
    super('This test does not have any assertions');
  }
}

class TestSucceeded extends TestWithDefinition {
  static canHandle(test) { return test.isSuccess(); }
  static handle(test) { test.finishWithSuccess(); }
  
  isSuccess() { return true; }
}

class TestFailed extends TestWithDefinition {
  static canHandle() { return true; }
  static handle(test) { test.finishWithFailure(); }
  
  constructor(failureMessage) {
    super();
    this._failureMessage = failureMessage;
  }
  failureMessage() { return this._failureMessage; }
}

module.exports = { TestResult, TestSucceeded, TestFailed, TestErrored };
