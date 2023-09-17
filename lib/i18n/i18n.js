'use strict';

import { isUndefined, subclassResponsibility } from '../utils.js';

// Change to import assertions when reaching Node 18
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const TRANSLATIONS = require('./translations');

class I18nMessage {
  static of(key, ...params) {
    return new InternationalizedMessage(key, ...params);
  }

  static empty() {
    return new EmptyMessage();
  }

  static joined(messages, joinedBy) {
    const messagesWithContent = messages.filter(message => message.hasContent());

    if (messagesWithContent.length === 0) {
      throw new Error('No messages with content have been found to be composed');
    } else if (messagesWithContent.length === 1) {
      return messagesWithContent.at(0);
    } else {
      return new ComposedInternationalizedMessage(messagesWithContent, joinedBy);
    }
  }

  expressedIn(_locale) {
    subclassResponsibility();
  }

  hasContent() {
    subclassResponsibility();
  }

  associatedKeys() {
    subclassResponsibility();
  }
}

class EmptyMessage extends I18nMessage {
  expressedIn(_locale) {
    return '';
  }

  hasContent() {
    return false;
  }

  associatedKeys() {
    return [];
  }
}

class ComposedInternationalizedMessage extends I18nMessage {
  constructor(messages, joinString) {
    super();
    this._messages = messages;
    this._joinString = joinString;
    Object.freeze(this);
  }

  expressedIn(locale) {
    return this._messages
      .map(message => message.expressedIn(locale))
      .join(this._joinString);
  }

  hasContent() {
    return true;
  }

  associatedKeys() {
    return this._messages.flatMap(subMessage => subMessage.associatedKeys());
  }
}

class InternationalizedMessage extends I18nMessage {
  constructor(key, ...params) {
    super();
    this._key = key;
    this._params = params;
    Object.freeze(this);
  }

  expressedIn(locale) {
    return locale.translate(this._key, ...this._params);
  }

  hasContent() {
    return true;
  }

  associatedKeys() {
    return [this._key];
  }
}

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
    // Node 15 will include the replaceAll() method
    return translatedText.replace(/%s/g, () => params.shift());
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

export { I18n, I18nMessage };
