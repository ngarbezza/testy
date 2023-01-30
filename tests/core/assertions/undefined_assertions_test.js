'use strict';

import { suite, test } from '../../../lib/testy.js';
import { resultOfATestWith } from '../../support/runner_helpers.js';
import { expectFailureOn, expectSuccess } from '../../support/assertion_helpers.js';

import { I18nMessage } from '../../../lib/i18n/i18n.js';

suite('undefined assertions', () => {
  test('isUndefined passes with an undefined value', async() => {
    const result = await resultOfATestWith(assert => assert.isUndefined(undefined));

    expectSuccess(result);
  });

  test('isUndefined does not pass with a another value', async() => {
    const result = await resultOfATestWith(assert => assert.isUndefined(null));

    expectFailureOn(result, I18nMessage.of('expectation_be_undefined', 'null'));
  });

  test('isNotUndefined passes with a not-undefined value', async() => {
    const result = await resultOfATestWith(assert => assert.isNotUndefined(null));

    expectSuccess(result);
  });

  test('isNotUndefined does not pass when the value is undefined', async() => {
    const result = await resultOfATestWith(assert => assert.isNotUndefined(undefined));

    expectFailureOn(result, I18nMessage.of('expectation_be_defined', 'undefined'));
  });
});
