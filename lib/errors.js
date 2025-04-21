class TestyError extends Error {
  #reason;

  constructor(reason) {
    super(reason.toString());
    this.#reason = reason;
  }

  reason() {
    return this.#reason;
  }
}

export class InvalidAssertionError extends TestyError {}
export class InvalidConfigurationError extends TestyError {}
export class InvalidConfigurationParameterError extends TestyError {}
export class InvalidConfigurationParametersOrderError extends TestyError {}
export class UnsupportedLanguageError extends TestyError {}
