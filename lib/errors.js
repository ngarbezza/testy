import { I18nMessage } from './i18n/i18n_messages.js';
import { I18n } from './i18n/i18n.js';

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

export class MissingTypescriptDependencyError extends TestyError {
  constructor(){
    super(I18nMessage.of('missing_typescript_dependency').expressedIn(I18n.default()));
  }
}
