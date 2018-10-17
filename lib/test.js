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
    this._result = { success: false, pending: true }
  }
  
  // testing
  hasEmptyDefinition() { return this._body === undefined }
  
  isSuccess() { return this._result.success }
  
  isPending() { return this._result.pending }
  
  // accessing
  name() { return this._name }
  result() { return this._result }
  
  // private
  bodyShouldBeEvaluated() { return typeof this._body === 'function' }
  evaluateTest(context) {
    this._result = this.bodyShouldBeEvaluated() ? this._body(context) : this._body;
  }
}

module.exports.Test = Test;