'use strict';

import { detectUserCallingLocation } from '../utils.js';
import { InvalidAssertionError } from '../errors/invalid_assertion_error.js';

/**
 * I represent all the possible results for a test, that can be:
 * - **success**: means that all the assertions on a test were successful
 * - **failure**: one of the test assertions failed, or the user triggered an explicit failure
 * - **error**: an unexpected exception occurred during the execution of the test
 * - **pending**: the user marked the test as such
 * - **skipped**: the test was not executed in the current run
 */
export class TestResult {
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

  static async evaluate(test, context) {
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
  static canHandle(_test, context) {
    return context.failFastMode.hasFailed();
  }

  static async handle(test) {
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

  static async handle(test) {
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

  static async handle(test, context) {
    await test.evaluate(context);
    const possibleResults = [TestWithoutAssertion, TestErrored, TestExplicitlyMarkedPending, TestSucceeded, TestFailed];
    // All results evaluate synchronously at this point, so we don't need to async/await this part of the code.
    possibleResults
      .find(result => result.canHandle(test))
      .handle(test, context);
  }

  constructor() {
    super();
    this._location = detectUserCallingLocation();
  }

  location() {
    return this._location;
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
    if (this._errorCause instanceof InvalidAssertionError) {
      return this._errorCause.reason();
    } else {
      return this._errorStackTrace() || this._errorCause;
    }
  }

  location() {
    // stack already includes failed line
    return this._errorStackTrace() ? '' : super.location();
  }

  _errorStackTrace() {
    return this._errorCause.stack;
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

  location() {
    return '';
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

  location() {
    return '';
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
