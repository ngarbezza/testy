'use strict';

import { suite, test } from '../../../lib/testy.js';
import { resultOfATestWith } from '../../support/runner_helpers.js';
import { expectErrorOn, expectFailureOn, expectPendingResultOn } from '../../support/assertion_helpers.js';

import { I18nMessage } from '../../../lib/i18n/i18n.js';

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
