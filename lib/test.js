'use strict';

const { TestResult, TestErrored } = require('./test_result');

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
      this.setResult(new TestErrored(error));
    }
  }
  
  markPending(pendingResult) {
    this.setResult(pendingResult);
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
  isSuccess() { return this.result().isSuccess(); }
  isPending() { return this.result().isPending(); }
  isError() { return this.result().isError(); }
  
  // accessing
  name() { return this._name; }
  result() { return this._result; }
}

module.exports = Test;
