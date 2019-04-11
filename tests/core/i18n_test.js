'use strict';

const { suite, test, assert } = require('../../testy');
const I18n = require('../../lib/i18n');

suite('i18n', () => {
  test('default language is en', () => {
    assert.areEqual(I18n.defaultLanguage(), 'en');
  });
  
  test('translating a existing message in the default language', () => {
    let translations = { en: { a_key: 'a text' } };
    const i18n = new I18n('en', translations);
    
    assert.areEqual(i18n.translate('a_key'), 'a text');
  });
  
  test('translating a existing message in another language', () => {
    let translations = { es: { a_key: 'un texto' } };
    const i18n = new I18n('es', translations);
    
    assert.areEqual(i18n.translate('a_key'), 'un texto');
  });
  
  test('an error is raised if the key is not found in the default language', () => {
    let translations = { en: { a_key: 'un texto' } };
    const i18n = new I18n('en', translations);
    
    assert
      .that(() => i18n.translate('other_key'))
      .raises('other_key not found in translations (language: en)!');
  });
  
  test('falls back to default language if the key is not found in the given language', () => {
    let translations = { en: { a_key: 'a text' } };
    const i18n = new I18n('es', translations);
    
    assert.areEqual(i18n.translate('a_key'), 'a text');
  });
});
