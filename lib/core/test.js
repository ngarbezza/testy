import { TestResult } from './test_result.js';
import { isFunction, isStringWithContent, isUndefined, notNullOrUndefined } from '../utils.js';
import { I18nMessage } from '../i18n/i18n_messages.js';

/**
 * I am an executable test, part of a [test suite]{@link TestSuite} and executed by a [test runner]{@link TestRunner}.
 * After the execution, I know the [result]{@link TestResult}. Tests must contain at least one assertion.
 * See {@link Asserter} and {@link Assertion} for more details on how to write those.
 */
export class Test {
  #name;
  #body;
  #callbacks;
  #result;
  #isMarkedAsExclusiveForRun;

  constructor(name, body, callbacks) {
    this.#initializeName(name);
    this.#initializeBody(body);
    this.#callbacks = callbacks;
    this.#result = undefined;
    this.#isMarkedAsExclusiveForRun = false;
  }

  // Execution

  async run(context) {
    const state = { isRunning: true };
    await Promise.race([
      this.#timeoutThreshold(context.testExecutionTimeoutMs, state),
      TestResult
        .evaluate(this, context)
        // eslint-disable-next-line no-return-assign
        .then(_result => state.isRunning = false),
    ]);
  }

  async evaluate(context) {
    await this.#evaluateHook(context.hooks.before);
    try {
      await this.#body.call();
    } catch (error) {
      this.setResult(TestResult.error(error));
    } finally {
      await this.#evaluateHook(context.hooks.after);
    }
  }

  markPending(pendingResult) {
    this.setResult(pendingResult);
    this.finishWithPendingStatus();
  }

  skip() {
    this.markExplicitlySkipped(TestResult.explicitlySkip());
  }

  markSkipped(skippedResult) {
    this.setResult(skippedResult);
    this.finishWithSkippedStatus();
  }

  markExplicitlySkipped(explicitlySkippedResult) {
    this.setResult(explicitlySkippedResult);
  }

  only() {
    this.#isMarkedAsExclusiveForRun = true;
  }

  isMarkedAsExclusiveForRun() {
    return this.#isMarkedAsExclusiveForRun;
  }

  setResult(result) {
    if (this.hasNoResult() || this.isSuccess()) {
      this.#result = result;
    }
  }

  finishWithSuccess() {
    this.#callbacks.whenSuccess(this);
  }

  finishWithFailure() {
    this.#callbacks.whenFailed(this);
  }

  finishWithError() {
    this.#callbacks.whenErrored(this);
  }

  finishWithPendingStatus() {
    this.#callbacks.whenPending(this);
  }

  finishWithSkippedStatus() {
    this.#callbacks.whenSkipped(this);
  }

  // Testing

  hasDefinition() {
    return !isUndefined(this.#body);
  }

  hasNoResult() {
    return isUndefined(this.result());
  }

  hasResult() {
    return notNullOrUndefined(this.result());
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

  isExplicitlySkipped() {
    return this.hasResult() && this.result().isExplicitlySkipped();
  }

  isError() {
    return this.result().isError();
  }

  isFailure() {
    return this.result().isFailure();
  }

  // Accessing

  name() {
    return this.#name;
  }

  result() {
    return this.#result;
  }

  // Private

  #initializeName(name) {
    this.#ensureNameIsValid(name);
    this.#name = name;
  }

  #initializeBody(body) {
    this.#ensureBodyIsValid(body);
    this.#body = body;
  }

  #ensureNameIsValid(name) {
    if (!isStringWithContent(name)) {
      throw new Error('Test does not have a valid name');
    }
  }

  #ensureBodyIsValid(body) {
    if (!isUndefined(body) && !isFunction(body)) {
      throw new Error('Test does not have a valid body');
    }
  }

  async #evaluateHook(hook) {
    if (isUndefined(hook)) {
      return;
    }

    try {
      await hook.call();
    } catch (error) {
      this.setResult(TestResult.error(error));
    }
  }

  #timeoutThreshold(timeoutMs, state) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (state.isRunning) {
          this.setResult(TestResult.error(I18nMessage.of('reached_timeout_error', timeoutMs)));
          this.finishWithError();
        }
        // This is resolve() and not reject() because we want other tests to be executed.
        // There was an error in terms of the test itself, but there was not an error in terms of Testy's execution.
        resolve();
      }, timeoutMs);
    });
  }
}
