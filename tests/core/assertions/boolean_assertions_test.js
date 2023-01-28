'use strict';

const { suite, test } = require('../../../lib/testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectSuccess, expectFailureOn } = require('../../support/assertion_helpers');

const { I18nMessage } = require('../../../lib/i18n/i18n');

suite('boolean assertions', () => {
  test('isTrue passes with true', async() => {
    const result = await resultOfATestWith(assert => assert.that(true).isTrue());

    expectSuccess(result);
  });

  test('isTrue does not pass with false', async() => {
    const result = await resultOfATestWith(assert => assert.that(false).isTrue());

    expectFailureOn(result, I18nMessage.of('expectation_be_true', 'false'));
  });

  test('isTrue does not pass with another value', async() => {
    const result = await resultOfATestWith(assert => assert.that(null).isTrue());

    expectFailureOn(result, I18nMessage.of('expectation_be_true', 'null'));
  });

  test('isFalse passes with false', async() => {
    const result = await resultOfATestWith(assert => assert.that(false).isFalse());

    expectSuccess(result);
  });

  test('isFalse does not pass with true', async() => {
    const result = await resultOfATestWith(assert => assert.that(true).isFalse());

    expectFailureOn(result, I18nMessage.of('expectation_be_false', 'true'));
  });

  test('isFalse does not pass with another value', async() => {
    const result = await resultOfATestWith(assert => assert.that(null).isFalse());

    expectFailureOn(result, I18nMessage.of('expectation_be_false', 'null'));
  });
});
