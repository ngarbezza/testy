'use strict';

class FailFast {
  static default() {
    return this.disabled();
  }
  
  static disabled() {
    return new this(false);
  }
  
  static enabled() {
    return new this(true);
  }
  
  constructor(enabled) {
    this._enabled = enabled;
    this._occurred = false;
  }
  
  enabled() {
    return this._enabled;
  }
  
  hasFailed() {
    return this._enabled && this._occurred;
  }
  
  registerFailure() {
    this._occurred = true;
  }
}

module.exports = FailFast;
