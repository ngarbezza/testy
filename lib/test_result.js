'use strict';

class TestResult {
  // instance creation messages
  
  static success() {
    return new TestSucceeded();
  }
  
  static failure(description) {
    return new TestFailed(description);
  }
  
  static error(errorCause) {
    return new TestErrored(errorCause);
  }
  
  static explicitlyMarkedAsPending(reason) {
    return new TestExplicitlyMarkedPending(reason);
  }
  
  // checking for test status
  
  static async evaluate(test, failFastMode) {
    return [SkippedTest, TestWithoutDefinition, TestWithDefinition]
      .find(result => result.canHandle(test, failFastMode))
      .handle(test, failFastMode);
  }
  
  // statuses
  
  isSuccess() {
    return false;
  }
  
  isPending() {
    return false;
  }
  
  isExplicitlyMarkedPending() {
    return false;
  }
  
  isError() {
    return false;
  }
  
  isFailure() {
    return false;
  }
  
  isSkipped() {
    return false;
  }
}

class SkippedTest extends TestResult {
  static canHandle(test, failFastMode) {
    return failFastMode.hasFailed();
  }
  
  static async handle(test) {
    test.markSkipped(new SkippedTest());
  }
  
  isSkipped() {
    return true;
  }
}

class TestWithoutDefinition extends TestResult {
  static canHandle(test) {
    return !test.hasDefinition();
  }
  
  static async handle(test) {
    test.markPending(new TestWithoutDefinition());
  }
  
  isPending() {
    return true;
  }
}

class TestWithDefinition extends TestResult {
  static canHandle(test) {
    return test.hasDefinition();
  }
  
  static async handle(test, failFastMode) {
    await test.evaluate();
    const possibleResults = [TestWithoutAssertion, TestErrored, TestExplicitlyMarkedPending, TestSucceeded, TestFailed];
    await possibleResults
      .find(result => result.canHandle(test))
      .handle(test, failFastMode);
  }
}

class TestExplicitlyMarkedPending extends TestWithDefinition {
  static canHandle(test) {
    return test.isPending();
  }
  
  static async handle(test) {
    test.finishWithPendingStatus();
  }
  
  constructor(reason) {
    super();
    this._reason = reason;
  }
  
  reason() {
    return this._reason;
  }
  
  isPending() {
    return true;
  }
  
  isExplicitlyMarkedPending() {
    return true;
  }
}

class TestErrored extends TestWithDefinition {
  static canHandle(test) {
    return test.isError();
  }
  
  static async handle(test, failFastMode) {
    failFastMode.registerFailure();
    test.finishWithError();
  }
  
  constructor(errorCause) {
    super();
    this._errorCause = errorCause;
  }
  
  isError() {
    return true;
  }
  
  failureMessage() {
    return this._errorCause.stack || this._errorCause;
  }
}

class TestWithoutAssertion extends TestErrored {
  static canHandle(test) {
    return test.hasNoResult();
  }
  
  static async handle(test, failFastMode) {
    test.setResult(new TestWithoutAssertion());
    await super.handle(test, failFastMode);
  }
  
  constructor() {
    super('This test does not have any assertions');
  }
}

class TestSucceeded extends TestWithDefinition {
  static canHandle(test) {
    return test.isSuccess();
  }
  
  static async handle(test) {
    test.finishWithSuccess();
  }
  
  isSuccess() {
    return true;
  }
}

class TestFailed extends TestWithDefinition {
  static canHandle() {
    return true;
  }
  
  static async handle(test, failFastMode) {
    failFastMode.registerFailure();
    test.finishWithFailure();
  }
  
  constructor(failureMessage) {
    super();
    this._failureMessage = failureMessage;
  }
  
  isFailure() {
    return true;
  }
  
  failureMessage() {
    return this._failureMessage;
  }
}

module.exports = TestResult;
