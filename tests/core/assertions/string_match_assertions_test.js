import { suite, test } from '../../../lib/testy.js';
import { resultOfATestWith } from '../../support/runner_helpers.js';
import { expectFailureOn, expectSuccess, expectErrorOn } from '../../support/assertion_helpers.js';

import { I18nMessage } from '../../../lib/i18n/i18n_messages.js';

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

  test('isMatching() shortcut fails with meaningful message when actual is undefined', async() => {
    const result = await resultOfATestWith(assert => assert.isMatching(undefined, /ll/));

    expectErrorOn(result, I18nMessage.of('invalid_actual_object_in_string_match', 'undefined'), '');
  });

  test('matches() passes with a exact string', async() => {
    const result = await resultOfATestWith(assert => assert.that('hola').matches('hola'));

    expectSuccess(result);
  });

  test('matches() fails with meaningful message when actual is undefined', async() => {
    const result = await resultOfATestWith(assert => assert.that(undefined).matches(/ll/));

    expectErrorOn(result, I18nMessage.of('invalid_actual_object_in_string_match', 'undefined'), '');
  });

  test('matches() fails with meaningful message when actual is null', async() => {
    const result = await resultOfATestWith(assert => assert.that(null).matches(/ll/));

    expectErrorOn(result, I18nMessage.of('invalid_actual_object_in_string_match', 'null'), '');
  });

  test('matches() fails with meaningful message when actual is a number', async() => {
    const result = await resultOfATestWith(assert => assert.that(42).matches(/ll/));

    expectErrorOn(result, I18nMessage.of('invalid_actual_object_in_string_match', '42'), '');
  });
});
