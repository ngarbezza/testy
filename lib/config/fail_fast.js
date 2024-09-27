import { isBoolean } from '../utils.js';
import { InvalidConfigurationError } from '../errors.js';

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

  #assertIsValidFailFastMode(failFastSettingValue) {
    if (!isBoolean(failFastSettingValue)) {
      throw new InvalidConfigurationError(this.#invalidEnableTypeErrorMessage(failFastSettingValue));
    }
  }

  #invalidEnableTypeErrorMessage(failFastSettingValue) {
    return `Expected a boolean value for failFast configuration, got: ${failFastSettingValue}`;
  }
}
