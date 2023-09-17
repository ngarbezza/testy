'use strict';

import { suite, test, assert } from '../../lib/testy.js';
import { I18n } from '../../lib/i18n/i18n.js';

suite('translation keys consistency', () => {
  const baseLanguageTranslations = I18n.allKeysForLanguage(I18n.defaultLanguage());

  I18n.supportedLanguages().forEach(language => {
    const languageKeys = I18n.allKeysForLanguage(language);
    const missingKeys = baseLanguageTranslations.filter(key => !languageKeys.includes(key));
    const extraKeys = languageKeys.filter(key => !baseLanguageTranslations.includes(key));

    test(`detects missing keys in ${language} language`, () => {
      assert.that(missingKeys).isEmpty();
    });

    test(`detects extra keys in ${language} language`, () => {
      assert.that(extraKeys).isEmpty();
    });
  });
});
