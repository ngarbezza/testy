'use strict';

const { suite, test, assert } = require('../../testy');
const { I18n } = require('../../lib/i18n');

suite('i18n', () => {
  test('default language is en', () => {
    assert.areEqual(I18n.defaultLanguage(), 'en');
  });
  
  test('translating a existing message in the default language', () => {
    const translations = { en: { aKey: 'a text' } };
    const i18n = new I18n('en', translations);
    
    assert.areEqual(i18n.translate('aKey'), 'a text');
  });
  
  test('translating a existing message in another language', () => {
    const translations = { es: { aKey: 'un texto' } };
    const i18n = new I18n('es', translations);
    
    assert.areEqual(i18n.translate('aKey'), 'un texto');
  });
  
  test('an error is raised if the key is not found in the default language', () => {
    const translations = { en: { aKey: 'un texto' } };
    const i18n = new I18n('en', translations);
    
    assert
      .that(() => i18n.translate('other_key'))
      .raises(/other_key not found in translations \(language: en\)!/);
  });
  
  test('falls back to default language if the key is not found in the given language', () => {
    const translations = { en: { aKey: 'a text' }, es: {} };
    const i18n = new I18n('es', translations);
    
    assert.areEqual(i18n.translate('aKey'), 'a text');
  });
  
  test('format a translation key with a parameter', () => {
    const translations = { en: { key: 'hello %s string' } };
    const i18n = new I18n('en', translations);
  
    assert.areEqual(i18n.translate('key', 'my friend'), 'hello my friend string');
  });
  
  test('formatting a translation key with less arguments than needed fails', () => {
    const translations = { en: { key: 'hello %s string' } };
    const i18n = new I18n('en', translations);
    
    assert.that(() => i18n.translate('key')).raises(/Expected 1 argument\(s\) on the translation string, got 0 instead/);
  });
  
  test('formatting a translation key with more arguments than needed fails', () => {
    const translations = { en: { key: 'hello %s string' } };
    const i18n = new I18n('en', translations);
    
    assert.that(() => i18n.translate('key', 'one', 'another')).raises(/Expected 1 argument\(s\) on the translation string, got 2 instead/);
  });
  
  test('format a translation key with a parameter', () => {
    const translations = { en: { key: 'the answer to %s is %s' } };
    const i18n = new I18n('en', translations);
    
    assert.areEqual(i18n.translate('key', 'everything', '42'), 'the answer to everything is 42');
  });
  
  test('it is not valid to create a translator for a language we do not have texts for', () => {
    const translations = { en: { key: 'something' }, es: { key: 'algo' } };
    
    assert.that(() => new I18n('xxxx', translations)).raises(/Language 'xxxx' is not supported. Allowed values: en, es/);
  });
});
