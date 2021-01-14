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
  
  static evaluate(test, context) {
    return [SkippedTest, TestWithoutDefinition, TestWithDefinition]
      .find(result => result.canHandle(test, context))
      .handle(test, context);
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
  static canHandle(test, context) {
    return context.failFastMode.hasFailed();
  }
  
  static handle(test) {
    test.markSkipped(new this());
  }
  
  isSkipped() {
    return true;
  }
}

class TestWithoutDefinition extends TestResult {
  static canHandle(test) {
    return !test.hasDefinition();
  }
  
  static handle(test) {
    test.markPending(new this());
  }
  
  isPending() {
    return true;
  }
}

class TestWithDefinition extends TestResult {
  static canHandle(test) {
    return test.hasDefinition();
  }
  
  static handle(test, context) {
    test.evaluate();
    const possibleResults = [TestWithoutAssertion, TestErrored, TestExplicitlyMarkedPending, TestSucceeded, TestFailed];
    possibleResults
      .find(result => result.canHandle(test))
      .handle(test, context);
  }
}

class TestExplicitlyMarkedPending extends TestWithDefinition {
  static canHandle(test) {
    return test.isPending();
  }
  
  static handle(test) {
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
  
  static handle(test, context) {
    context.failFastMode.registerFailure();
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
  
  static handle(test, context) {
    test.setResult(new this());
    super.handle(test, context);
  }
  
  constructor() {
    super('This test does not have any assertions');
  }
}

class TestSucceeded extends TestWithDefinition {
  static canHandle(test) {
    return test.isSuccess();
  }
  
  static handle(test) {
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
  
  static handle(test, context) {
    context.failFastMode.registerFailure();
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
