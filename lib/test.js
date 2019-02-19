'use strict';

const TestResult = {
  evaluate(test, context) {
    return [TestWithoutDefinition, TestWithDefinition].
      find(result => result.canHandle(test)).
      handle(test, context);
  },
};

const TestWithoutDefinition = {
  __proto__: TestResult,
  canHandle(test) { return !test.hasDefinition(); },
  handle(test) { test.markPending(); },
};

const TestWithDefinition = {
  __proto__: TestResult,
  canHandle(test) { return test.hasDefinition(); },
  
  handle(test, context) {
    test.evaluate(context);
    this._determineFinalTestResult(test);
  },
  
  _determineFinalTestResult(test) {
    const possibleResults = [TestWithoutAssertion, TestErrored, TestSucceeded, TestFailed];
    possibleResults.find(result => result.canHandle(test)).handle(test);
  },
};

const TestWithoutAssertion = {
  __proto__: TestWithDefinition,
  canHandle(test) { return test.hasNoResult(); },
  handle(test) { test.failBecauseOfNoAssertions(); },
};

const TestErrored = {
  __proto__: TestWithDefinition,
  canHandle(test) { return test.isError(); },
  handle(test) { test.finishWithError(); },
};

const TestSucceeded = {
  __proto__: TestWithDefinition,
  canHandle(test) { return test.isSuccess(); },
  handle(test) { test.finishWithSuccess(); },
};

const TestFailed = {
  __proto__: TestWithDefinition,
  canHandle() { return true; },
  handle(test) { test.finishWithFailure(); },
};

class Test {
  constructor(name, body, callbacks) {
    this._name = name;
    this._body = body;
    this._callbacks = callbacks;
    this._result = undefined;
  }
  
  // execution
  run(context) { TestResult.evaluate(this, context); }
  evaluate(context) {
    try {
      this._body(context);
    } catch (error) {
      this._setFailureDueTo(error.stack);
    }
  }
  
  failBecauseOfNoAssertions() {
    this._setFailureDueTo('This test does not have any assertions');
    this.finishWithError();
  }
  markPending() {
    this.setResult({ success: false, pending: true });
    this._callbacks.whenPending(this);
  }
  setResult(result) {
    if(this.hasNoResult() || this.isSuccess()) this._result = result;
  }
  finishWithSuccess() { this._callbacks.whenSuccess(this); }
  finishWithFailure() { this._callbacks.whenFailed(this); }
  finishWithError() { this._callbacks.whenErrored(this); }
  
  // testing
  hasDefinition() { return this._body !== undefined; }
  hasNoResult() { return this._result === undefined; }
  isSuccess() { return this.result().success; }
  isPending() { return this.result().pending; }
  isError() { return this.result().error; }
  
  // accessing
  name() { return this._name; }
  result() { return this._result; }
  
  // private
  _setFailureDueTo(failureMessage) {
    this.setResult({ success: false, error: true, failureMessage: failureMessage});
  }
}

module.exports = Test;
