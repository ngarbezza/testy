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
      this.evaluateTest(context);
      if (this.isSuccess()) {
        this._callbacks.whenSuccess(this);
      } else {
        this._callbacks.whenFailed(this);
      }
    }
  }
  markPending() {
    this.setResult({ success: false, pending: true })
  }
  setResult(result) {
    this._result = result
  }
  
  // testing
  hasEmptyDefinition() { return this._body === undefined }
  isSuccess() { return this.result().success }
  isPending() { return this.result().pending }
  
  // accessing
  name() { return this._name }
  result() { return this._result }
  
  // private
  evaluateTest(context) { this._body(context) }
}

module.exports.Test = Test;