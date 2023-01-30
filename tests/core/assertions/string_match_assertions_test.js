'use strict';

import { suite, test } from '../../../lib/testy.js';
import { resultOfATestWith } from '../../support/runner_helpers.js';
import { expectFailureOn, expectSuccess } from '../../support/assertion_helpers.js';

import { I18nMessage } from '../../../lib/i18n/i18n.js';

suite('assertions about strings match', () => {
  test('matches() passes when the regex match the actual string', async() => {
    const result = await resultOfATestWith(assert => assert.that('hello').matches(/ll/));

    expectSuccess(result);
  });

  test('matches() fails when the regex does the actual string', async() => {
    const result = await resultOfATestWith(assert => assert.that('goodbye').matches(/ll/));

    expectFailureOn(result, I18nMessage.of('expectation_match_regex', "'goodbye'", /ll/));
  });

  test('isMatching() shortcut works', async() => {
    const result = await resultOfATestWith(assert => assert.isMatching('hello', /ll/));

    expectSuccess(result);
  });

  test('matches() passes with a exact string', async() => {
    const result = await resultOfATestWith(assert => assert.that('hola').matches('hola'));

    expectSuccess(result);
  });
});
