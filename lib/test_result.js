'use strict';

class TestResult {
  static evaluate(test, failFastMode) {
    return [SkippedTest, TestWithoutDefinition, TestWithDefinition].
      find(result => result.canHandle(test, failFastMode)).
      handle(test, failFastMode);
  }
  
  isSuccess() { return false; }
  isPending() { return false; }
  isError() { return false; }
  isFailure() { return false; }
  isSkipped() { return false; }
}

class SkippedTest extends TestResult {
  static canHandle(test, failFastMode) { return failFastMode.hasFailed(); }
  static handle(test) { test.markSkipped(new SkippedTest()); }
  
  isSkipped() { return true; }
}

class TestWithoutDefinition extends TestResult {
  static canHandle(test) { return !test.hasDefinition(); }
  static handle(test) { test.markPending(new TestWithoutDefinition()); }
  
  isPending() { return true; }
}

class TestWithDefinition extends TestResult {
  static canHandle(test) { return test.hasDefinition(); }
  
  static handle(test, failFastMode) {
    test.evaluate();
    const possibleResults = [TestWithoutAssertion, TestErrored, TestSucceeded, TestFailed];
    possibleResults.find(result => result.canHandle(test)).handle(test, failFastMode);
  }
}

class TestErrored extends TestWithDefinition {
  static canHandle(test) { return test.isError(); }
  static handle(test, failFastMode) {
    failFastMode.registerFailure();
    test.finishWithError();
  }
  
  constructor(error) {
    super();
    this._error = error;
  }
  
  isError() { return true; }
  failureMessage() { return this._error.stack || this._error; }
}

class TestWithoutAssertion extends TestErrored {
  static canHandle(test) { return test.hasNoResult(); }
  static handle(test, failFastMode) {
    test.setResult(new TestWithoutAssertion());
    super.handle(test, failFastMode);
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
  static handle(test, failFastMode) {
    failFastMode.registerFailure();
    test.finishWithFailure();
  }
  
  constructor(failureMessage) {
    super();
    this._failureMessage = failureMessage;
  }
  isFailure() { return true; }
  failureMessage() { return this._failureMessage; }
}

module.exports = { TestResult, TestSucceeded, TestFailed, TestErrored };
