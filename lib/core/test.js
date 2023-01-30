'use strict';

import { TestResult } from './test_result.js';
import { isFunction, isStringWithContent, isUndefined } from '../utils.js';

/**
 * I am an executable test, part of a {@link TestSuite} and executed by a {@link TestRunner}.
 * After the execution, I know the result ({@link TestResult}). Tests must contain at least one assertion.
 * See {@link Asserter} and {@link Assertion} for more details on how to write those.
 */
export class Test {
  constructor(name, body, callbacks) {
    this._initializeName(name);
    this._initializeBody(body);
    this._callbacks = callbacks;
    this._result = undefined;
  }

  // Execution

  async run(context) {
    await Promise.race([
      this._timeoutThreshold(),
      TestResult.evaluate(this, context),
    ]);
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

  _timeoutThreshold() {
    return new Promise(resolve => {
      // TODO make timeout configurable
      const timeoutMs = 1000;
      setTimeout(() => {
        const timeoutError = new Error(`Timeout of ${timeoutMs}ms reached. Your test could not finish its execution.`);
        this.setResult(TestResult.error(timeoutError));
        this.finishWithError();
        // This is resolve() and not reject() because we want other tests to be executed.
        // There was an error in terms of the test itself, but there was not an error in terms of Testy's execution.
        resolve();
      }, timeoutMs);
    });
  }
}
