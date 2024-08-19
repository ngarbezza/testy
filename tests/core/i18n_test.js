'use strict';

import { assert, suite, test } from '../../lib/testy.js';

import { I18n } from '../../lib/i18n/i18n.js';

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
      .raises(/Translation key 'other_key' not found in translations for language: en!/);
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

  test('supported languages list is empty when the translations do not include any language', () => {
    const noTranslations = {};
    assert.that(I18n.supportedLanguages(noTranslations)).isEmpty();
  });

  test('supported languages list contains all the top-level keys in the translations input', () => {
    const translations = { fr: {}, br: {}, jp: {} };
    assert.that(I18n.supportedLanguages(translations)).includesExactly('fr', 'br', 'jp');
  });

  test('all keys for language for non-supported language returns an empty list', () => {
    const noTranslations = {};
    assert.that(I18n.allKeysForLanguage('es', noTranslations)).isEmpty();
  });

  test('all keys for language for a language with no keys returns an empty list', () => {
    const translations = { es: {} };
    assert.that(I18n.allKeysForLanguage('es', translations)).isEmpty();
  });

  test('all keys for language returns only keys from that language', () => {
    const translations = { es: { key1: 'value1', key2: 'value2' }, jp: { key3: 'value3' } };
    assert.that(I18n.allKeysForLanguage('es', translations)).includesExactly('key1', 'key2');
  });

  test('fails when a key is not present on all languages', () => {
    const translations = { es: { key1: 'value1', key2: 'value2' }, jp: { key1: 'value3' } };
    assert
      .that(() => I18n.ensureKeyIsPresentOnAllLanguages('key2', translations))
      .raises(/Translation key 'key2' not found in translations for language: jp!/);
  });

  test('does not fail when a key is present on all languages', () => {
    const translations = { es: { key1: 'value1', key2: 'value2' }, jp: { key1: 'value3' } };
    assert
      .that(() => I18n.ensureKeyIsPresentOnAllLanguages('key1', translations))
      .doesNotRaiseAnyErrors();
  });
});
