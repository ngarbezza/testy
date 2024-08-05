import { suite, test } from '../../../lib/testy.js';
import { resultOfATestWith } from '../../support/runner_helpers.js';
import { expectFailureOn, expectSuccess } from '../../support/assertion_helpers.js';

import { I18nMessage } from '../../../lib/i18n/i18n_messages.js';

suite('assertions about null', () => {
  test('isNull passes with a null value', async() => {
    const result = await resultOfATestWith(assert => assert.isNull(null));

    expectSuccess(result);
  });

  test('isNull does not pass with a another value', async() => {
    const result = await resultOfATestWith(assert => assert.isNull(undefined));

    expectFailureOn(result, I18nMessage.of('expectation_be_null', 'undefined'));
  });

  test('isNotNull passes with a non-null value', async() => {
    const result = await resultOfATestWith(assert => assert.isNotNull(3));

    expectSuccess(result);
  });

  test('isNotNull does not pass when the value is null', async() => {
    const result = await resultOfATestWith(assert => assert.isNotNull(null));

    expectFailureOn(result, I18nMessage.of('expectation_be_not_null', 'null'));
  });
});
