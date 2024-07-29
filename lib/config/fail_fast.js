'use strict';
import { isBoolean } from '../utils.js';

export class FailFast {
  #enabled;
  #occurred;

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

  constructor(enabled) {
    this.#assertIsValidFailFastMode(enabled);
    this.#enabled = enabled;
    this.#occurred = false;
  }

  enabled() {
    return this.#enabled;
  }

  hasFailed() {
    return this.#enabled && this.#occurred;
  }

  registerFailure() {
    this.#occurred = true;
  }

  // assertions

  #assertIsValidFailFastMode(enabled) {
    if (!isBoolean(enabled)) {
      throw new Error(FailFast.invalidEnableTypeErrorMessage());
    }
  }
}
