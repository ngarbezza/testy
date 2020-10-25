'use strict';

const TestResult = require('./test_result');
const FailFast = require('./fail_fast');
const { isString, isStringNullOrWhiteSpace, isFunction, isUndefined } = require('./utils');

class Test {
  constructor(name, body, callbacks) {
    this._initializeName(name);
    this._initializeBody(body);
    this._callbacks = callbacks;
    this._result = undefined;
  }
  
  // Execution
  
  run(failFastMode = FailFast.default()) {
    TestResult.evaluate(this, failFastMode);
  }
  
  evaluate() {
    try {
      this.body().call();
    } catch (error) {
      this.setResult(TestResult.error(error));
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
    if (!isString(name)) {
      throw 'Test does not have a valid name';
    }
    if (isStringNullOrWhiteSpace(name)) {
      throw 'Suite and test names cannot be empty';
    }
  }
  
  _ensureBodyIsValid(body) {
    if (!isUndefined(body) && !isFunction(body)) {
      throw 'Test does not have a valid body';
    }
  }
}

module.exports = Test;
