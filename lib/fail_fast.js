'use strict';

class FailFast {
  static default() { return new FailFast(false); }
  
  constructor(enabled) {
    this._enabled = enabled;
    this._occurred = false;
  }
  
  hasFailed() { return this._enabled && this._occurred; }
  registerFailure() { this._occurred = true; }
}

module.exports = FailFast;
