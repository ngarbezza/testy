'use strict';

const { suite, test } = require('../../../lib/testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectSuccess, expectFailureOn } = require('../../support/assertion_helpers');

const { I18nMessage } = require('../../../lib/i18n');

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
