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

export class InvalidAssertionError extends TestyError {
}

export class InvalidConfigurationError extends TestyError {
}

export class ConfigurationParsingError extends TestyError {
}
