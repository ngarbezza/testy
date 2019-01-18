class Test {
  constructor(name, body, callbacks) {
    this._name = name;
    this._body = body;
    this._callbacks = callbacks;
    this._result = undefined;
  }
  
  // execution
  run(context) {
    if (this.hasEmptyDefinition()) {
      this.markPending();
      this._callbacks.whenPending(this);
    } else {
      this._evaluateTest(context);
      if (this.hasNoResult()) {
        this._failBecauseOfNoAssertions();
      } else if (this.isError()) {
        this._callbacks.whenErrored(this);
      } else if (this.isSuccess()) {
        this._callbacks.whenSuccess(this);
      } else {
        this._callbacks.whenFailed(this);
      }
    }
  }
  markPending() {
    this.setResult({ success: false, pending: true });
  }
  setResult(result) { this._result = result; }
  
  // testing
  hasEmptyDefinition() { return this._body === undefined; }
  hasNoResult() { return this._result === undefined; }
  isSuccess() { return this.result().success; }
  isPending() { return this.result().pending; }
  isError() { return this.result().error; }
  
  // accessing
  name() { return this._name; }
  result() { return this._result; }
  
  // private
  _evaluateTest(context) {
    try {
      this._body(context);
    } catch (error) {
      this._setFailureDueTo(error.stack);
    }
  }
  
  _failBecauseOfNoAssertions() {
    this._setFailureDueTo('This test does not have any assertions');
    this._callbacks.whenErrored(this);
  }
  
  _setFailureDueTo(failureMessage) {
    this.setResult({ success: false, error: true, failureMessage: failureMessage});
  }
}

module.exports = Test;
