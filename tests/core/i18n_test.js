'use strict';

const { suite, test, assert } = require('../../testy');
const I18n = require('../../lib/i18n');

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
      .raises('other_key not found in translations (language: en)!');
  });
  
  test('falls back to default language if the key is not found in the given language', () => {
    const translations = { en: { aKey: 'a text' } };
    const i18n = new I18n('es', translations);
    
    assert.areEqual(i18n.translate('aKey'), 'a text');
  });
});
