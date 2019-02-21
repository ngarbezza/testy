'use strict';

const TestResult = require('./test_result');

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
