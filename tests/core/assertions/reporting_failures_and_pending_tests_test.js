'use strict';

const { suite, test } = require('../../../lib/testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectErrorOn, expectFailureOn, expectPendingResultOn } = require('../../support/assertion_helpers');

const { I18nMessage } = require('../../../lib/i18n');

suite('reporting failures and pending tests', () => {
  test('marking a test as explicitly failed with no message', async() => {
    const result = await resultOfATestWith((_assert, fail, _pending) => fail.with());

    expectFailureOn(result, I18nMessage.of('explicitly_failed'));
  });

  test('marking a test as explicitly failed with a custom message', async() => {
    const result = await resultOfATestWith((_assert, fail, _pending) => fail.with('I should not be here!'));

    expectFailureOn(result, 'I should not be here!');
  });

  test('marking a test as pending with no message', async() => {
    const result = await resultOfATestWith((_assert, _fail, pending) => pending.dueTo());

    expectErrorOn(result, I18nMessage.of('invalid_pending_reason'));
  });

  test('marking a test as pending with a custom message', async() => {
    const result = await resultOfATestWith((_assert, _fail, pending) => pending.dueTo('No time to fix!'));

    expectPendingResultOn(result, 'No time to fix!');
  });
});
