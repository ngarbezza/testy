'use strict';

const TRANSLATIONS = require('./translations');
const { subclassResponsibility, isUndefined } = require('./utils');

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
      return messagesWithContent[0];
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
}

class EmptyMessage extends I18nMessage {
  expressedIn(_locale) {
    return '';
  }
  
  hasContent() {
    return false;
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
}

class I18n {
  static default(translations = TRANSLATIONS) {
    return new this(this.defaultLanguage(), translations);
  }
  
  static defaultLanguage() {
    return 'en';
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
    const supportedLanguages = Object.keys(translations);
    if (!supportedLanguages.includes(languageCode)) {
      throw new Error(`Language '${languageCode}' is not supported. Allowed values: ${supportedLanguages.join(', ')}`);
    }
  }
  
  _validateResultingTextExists(text, key) {
    if (isUndefined(text)) {
      throw new Error(this._keyNotFoundMessage(key));
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
    if (translatedTextArguments.length > 0) {
      this._validateNumberOfArgumentsMatch(translatedTextArguments, params);
      // Node 15 will include the replaceAll() method
      return translatedText.replace(/%s/g, () => params.shift());
    } else {
      return translatedText;
    }
  }
  
  _translationsForCurrentLanguage() {
    return this._translations[this._languageCode];
  }
  
  _defaultTranslationFor(key) {
    return this._translations[I18n.defaultLanguage()][key];
  }
  
  // error messages
  
  _keyNotFoundMessage(key) {
    return `${key} not found in translations (language: ${this._languageCode})!`;
  }
  
  _wrongNumberOfArgumentsErrorMessage(expectedParams, givenParams) {
    return `Expected ${expectedParams.length} argument(s) on the translation string, got ${givenParams.length} instead`;
  }
}

module.exports = { I18n, I18nMessage };
