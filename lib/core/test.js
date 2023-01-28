'use strict';

const TestResult = require('./test_result');
const { isStringWithContent, isFunction, isUndefined } = require('../utils');

/**
 * I am an executable test, part of a {@link TestSuite} and executed by a {@link TestRunner}.
 * After the execution, I know the result ({@link TestResult}). Tests must contain at least one assertion.
 * See {@link Asserter} and {@link Assertion} for more details on how to write those.
 */
class Test {
  constructor(name, body, callbacks) {
    this._initializeName(name);
    this._initializeBody(body);
    this._callbacks = callbacks;
    this._result = undefined;
  }

  // Execution

  async run(context) {
    await TestResult.evaluate(this, context);
  }

  async evaluate(context) {
    await this._evaluateHook(context.hooks.before);
    try {
      await this.body().call();
    } catch (error) {
      this.setResult(TestResult.error(error));
    } finally {
      await this._evaluateHook(context.hooks.after);
    }
  }

  markPending(pendingResult) {
    this.setResult(pendingResult);
    this.finishWithPendingStatus();
  }

  markSkipped(skippedResult) {
    this.setResult(skippedResult);
    this._callbacks.whenSkipped(this);
  }

  setResult(result) {
    if (this.hasNoResult() || this.isSuccess()) {
      this._result = result;
    }
  }

  finishWithSuccess() {
    this._callbacks.whenSuccess(this);
  }

  finishWithFailure() {
    this._callbacks.whenFailed(this);
  }

  finishWithError() {
    this._callbacks.whenErrored(this);
  }

  finishWithPendingStatus() {
    this._callbacks.whenPending(this);
  }

  // Testing

  hasDefinition() {
    return !isUndefined(this.body());
  }

  hasNoResult() {
    return isUndefined(this.result());
  }

  isSuccess() {
    return this.result().isSuccess();
  }

  isPending() {
    return this.result().isPending();
  }

  isExplicitlyMarkedPending() {
    return this.result().isExplicitlyMarkedPending();
  }

  isSkipped() {
    return this.result().isSkipped();
  }

  isError() {
    return this.result().isError();
  }

  isFailure() {
    return this.result().isFailure();
  }

  // Accessing

  name() {
    return this._name;
  }

  result() {
    return this._result;
  }

  body() {
    return this._body;
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
      throw new Error('Test does not have a valid name');
    }
  }

  _ensureBodyIsValid(body) {
    if (!isUndefined(body) && !isFunction(body)) {
      throw new Error('Test does not have a valid body');
    }
  }

  async _evaluateHook(hook) {
    try {
      hook && await hook.call();
    } catch (error) {
      this.setResult(TestResult.error(error));
    }
  }
}

module.exports = Test;
