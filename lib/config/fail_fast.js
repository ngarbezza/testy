'use strict';
import { isBoolean } from '../utils.js';

export class FailFast {
  static default() {
    return this.disabled();
  }

  static disabled() {
    return new this(false);
  }

  static enabled() {
    return new this(true);
  }

  static invalidEnableTypeErrorMessage(){
    return 'Expected a boolean value for failFast configuration';
  }

  // assertions

  assertIsValidFailFastMode(enabled) {
    if (!isBoolean(enabled)){
      throw new Error(FailFast.invalidEnableTypeErrorMessage());
    }
  }

  constructor(enabled) {
    this.assertIsValidFailFastMode(enabled);
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
