'use strict';

const TRANSLATIONS = require('./translations');
const { isUndefined } = require('./utils');

class I18n {
  static defaultLanguage() {
    return 'en';
  }
  
  constructor(languageCode = I18n.defaultLanguage(), translations = TRANSLATIONS) {
    this._languageCode = languageCode;
    this._translations = translations;
  }
  
  translate(key) {
    const languageTranslations = this.translationsForCurrentLanguage();
    const translatedText = languageTranslations[key] || this.defaultTranslationFor(key);
    if (isUndefined(translatedText)) {
      throw this.keyNotFoundMessage(key);
    }
    return translatedText;
  }
  
  translationsForCurrentLanguage() {
    return this._translations[this._languageCode] || {};
  }
  
  defaultTranslationFor(key) {
    return this._translations[I18n.defaultLanguage()][key];
  }
  
  keyNotFoundMessage(key) {
    return `${key} not found in translations (language: ${this._languageCode})!`;
  }
}

module.exports = I18n;
