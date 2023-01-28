'use strict';

const { suite, test } = require('../../../lib/testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectSuccess, expectFailureOn } = require('../../support/assertion_helpers');

const { I18nMessage } = require('../../../lib/i18n/i18n');

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
