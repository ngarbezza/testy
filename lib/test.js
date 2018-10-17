class Test {
  constructor(name, body) {
    this._name = name;
    this._body = body;
    this._result = undefined;
  }
  
  // execution
  run(callbacks) {
    if (this.hasEmptyDefinition()) {
      this.markPending();
      callbacks.whenPending();
    } else {
      this._result = this.bodyShouldBeEvaluated() ? this._body() : this._body;
      if (this.isSuccess()) {
        callbacks.whenSuccess();
      } else {
        callbacks.whenFailed();
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
  bodyShouldBeEvaluated() {
    return typeof this._body === 'function'
  }
}

module.exports.Test = Test;