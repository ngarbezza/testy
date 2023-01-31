'use strict';

import { suite, test, assert } from '../../lib/testy.js';

// Change to import assertions when reaching Node 18
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const TRANSLATIONS = require('../../lib/i18n/translations');

suite('translation keys consistency', () => {
  const baseLanguage = 'en';
  const baseLanguageTranslations = Object.keys(TRANSLATIONS[baseLanguage]);

  Object.keys(TRANSLATIONS).forEach(language => {
    const languageKeys = Object.keys(TRANSLATIONS[language]);
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
