import { isUndefined } from '../utils.js';
import { InvalidConfigurationError } from '../errors.js';

// Change to import assertions when reaching Node 22
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const TRANSLATIONS = require('./translations');

class I18n {
  #languageCode;
  #translations;

  static ensureKeyIsPresentOnAllLanguages(key, translations = TRANSLATIONS) {
    this.supportedLanguages(translations).forEach(languageCode => {
      if (!translations[languageCode][key]) {
        throw new Error(this.keyNotFoundMessage(key, languageCode));
      }
    });
  }

  static default(translations = TRANSLATIONS) {
    return new this(this.defaultLanguage(), translations);
  }

  static allKeysForLanguage(languageCode, translations = TRANSLATIONS) {
    return Object.keys(translations[languageCode] || {});
  }

  static supportedLanguages(translations = TRANSLATIONS) {
    return Object.keys(translations);
  }

  static defaultLanguage() {
    return 'en';
  }

  static keyNotFoundMessage(key, languageCode) {
    return `Translation key '${key}' not found in translations for language: ${languageCode}!`;
  }

  static unsupportedLanguageException(languageCode, supportedLanguages) {
    throw new InvalidConfigurationError(`Language '${languageCode}' is not supported. Allowed values: ${supportedLanguages.join(', ')}`);
  }

  constructor(languageCode, translations = TRANSLATIONS) {
    this.#assertLanguageIsSupported(languageCode, translations);
    this.#languageCode = languageCode;
    this.#translations = translations;
  }

  translate(key, ...params) {
    const languageTranslations = this.#translationsForCurrentLanguage();
    const translatedText = languageTranslations[key] || this.#defaultTranslationFor(key);
    this.#validateResultingTextExists(translatedText, key);
    return this.#evaluateWithPotentialArguments(translatedText, params);
  }

  // assertions

  #assertLanguageIsSupported(languageCode, translations) {
    const supportedLanguages = I18n.supportedLanguages(translations);
    if (!supportedLanguages.includes(languageCode)) {
      I18n.unsupportedLanguageException(languageCode, supportedLanguages);
    }
  }

  #validateResultingTextExists(text, key) {
    if (isUndefined(text)) {
      throw new Error(I18n.keyNotFoundMessage(key, this.#languageCode));
    }
  }

  #validateNumberOfArgumentsMatch(expectedParams, givenParams) {
    if (expectedParams.length !== givenParams.length) {
      throw new Error(this.#wrongNumberOfArgumentsErrorMessage(expectedParams, givenParams));
    }
  }

  // private

  #evaluateWithPotentialArguments(translatedText, params) {
    const translatedTextArguments = translatedText.match(/%s/g) || [];
    this.#validateNumberOfArgumentsMatch(translatedTextArguments, params);
    return translatedText.replaceAll('%s', () => params.shift());
  }

  #translationsForCurrentLanguage() {
    return this.#translations[this.#languageCode];
  }

  #defaultTranslationFor(key) {
    return this.#translations[I18n.defaultLanguage()][key];
  }

  // error messages
  #wrongNumberOfArgumentsErrorMessage(expectedParams, givenParams) {
    return `Expected ${expectedParams.length} argument(s) on the translation string, got ${givenParams.length} instead`;
  }
}

export { I18n };
