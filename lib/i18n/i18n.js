'use strict';

import { isUndefined } from '../utils.js';

// Change to import assertions when reaching Node 18
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const TRANSLATIONS = require('./translations');

class I18n {
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

  constructor(languageCode, translations = TRANSLATIONS) {
    this._assertLanguageIsSupported(languageCode, translations);
    this._languageCode = languageCode;
    this._translations = translations;
  }

  translate(key, ...params) {
    const languageTranslations = this._translationsForCurrentLanguage();
    const translatedText = languageTranslations[key] || this._defaultTranslationFor(key);
    this._validateResultingTextExists(translatedText, key);
    return this._evaluateWithPotentialArguments(translatedText, params);
  }

  // assertions

  _assertLanguageIsSupported(languageCode, translations) {
    const supportedLanguages = I18n.supportedLanguages(translations);
    if (!supportedLanguages.includes(languageCode)) {
      throw new Error(`Language '${languageCode}' is not supported. Allowed values: ${supportedLanguages.join(', ')}`);
    }
  }

  _validateResultingTextExists(text, key) {
    if (isUndefined(text)) {
      throw new Error(I18n.keyNotFoundMessage(key, this._languageCode));
    }
  }

  _validateNumberOfArgumentsMatch(expectedParams, givenParams) {
    if (expectedParams.length !== givenParams.length) {
      throw new Error(this._wrongNumberOfArgumentsErrorMessage(expectedParams, givenParams));
    }
  }

  // private

  _evaluateWithPotentialArguments(translatedText, params) {
    const translatedTextArguments = translatedText.match(/%s/g) || [];
    this._validateNumberOfArgumentsMatch(translatedTextArguments, params);
    return translatedText.replaceAll('%s', () => params.shift());
  }

  _translationsForCurrentLanguage() {
    return this._translations[this._languageCode];
  }

  _defaultTranslationFor(key) {
    return this._translations[I18n.defaultLanguage()][key];
  }

  // error messages
  _wrongNumberOfArgumentsErrorMessage(expectedParams, givenParams) {
    return `Expected ${expectedParams.length} argument(s) on the translation string, got ${givenParams.length} instead`;
  }
}

export { I18n };
