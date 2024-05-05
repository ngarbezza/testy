'use strict';

import { suite, test } from '../../../lib/testy.js';
import { resultOfATestWith } from '../../support/runner_helpers.js';
import { expectFailureOn, expectSuccess } from '../../support/assertion_helpers.js';

import { I18nMessage } from '../../../lib/i18n/i18n_messages.js';

suite('numeric assertions', () => {
  test('isNearTo passes if an exact integer matches', async() => {
    const result = await resultOfATestWith(assert => assert.that(42).isNearTo(42));

    expectSuccess(result);
  });

  test('isNearTo fails if the integer part of the number is not equal', async() => {
    const result = await resultOfATestWith(assert => assert.that(42).isNearTo(43));

    expectFailureOn(result, I18nMessage.of('expectation_be_near_to', '42', '43', '4'));
  });

  test('isNearTo passes if the actual number rounded using the specified decimals matches the expected number', async() => {
    const result = await resultOfATestWith(assert => assert.that(42.0001).isNearTo(42, 3));

    expectSuccess(result);
  });

  test('isNearTo fails if the actual number rounded using the specified decimals does not match the expected number', async() => {
    const result = await resultOfATestWith(assert => assert.that(42.001).isNearTo(42, 3));

    expectFailureOn(result, I18nMessage.of('expectation_be_near_to', '42.001', '42', '3'));
  });

  test('isNearTo passes with a default precision of 4', async() => {
    const result = await resultOfATestWith(assert => assert.that(42.00001).isNearTo(42));

    expectSuccess(result);
  });

  test('isNearTo passes with a classical floating point representation issue', async() => {
    const result = await resultOfATestWith(assert => assert.that(0.1 + 0.2).isNearTo(0.3));

    expectSuccess(result);
  });

  test('isGreaterThan passes if the number is strictly smaller', async () => {
    const result = await resultOfATestWith(assert => assert.that(2).isGreaterThan(1));

    expectSuccess(result);
  })

  test('isGreaterThan fails if the numbers are equal', async () => {
    const result = await resultOfATestWith(assert => assert.that(2).isGreaterThan(2));

    expectFailureOn(result, I18nMessage.of('expectation_be_greater_than', '2', '2'));
  })

  test('isGreaterThan fails if the number is bigger', async () => {
    const result = await resultOfATestWith(assert => assert.that(1).isGreaterThan(2));

    expectFailureOn(result, I18nMessage.of('expectation_be_greater_than', '1', '2'));
  })

  test('isLessThan passes if the number is strictly bigger', async () => {
    const result = await resultOfATestWith(assert => assert.that(1).isLessThan(2));

    expectSuccess(result);
  });

  test('isLessThan fails if the numbers are equal', async () => {
    const result = await resultOfATestWith(assert => assert.that(2).isLessThan(2));

    expectFailureOn(result, I18nMessage.of('expectation_be_less_than', '2', '2'));
  })

  test('isLessThan fails if the number is smaller', async () => {
    const result = await resultOfATestWith(assert => assert.that(2).isLessThan(1));

    expectFailureOn(result, I18nMessage.of('expectation_be_less_than', '2', '1'));
  })

  test('isGreaterThanOrEqualTo passes if the number is strictly smaller', async () => {
    const result = await resultOfATestWith(assert => assert.that(2).isGreaterThanOrEqualTo(1));

    expectSuccess(result);
  })

  test('isGreaterThanOrEqualTo passes if the numbers are equal', async () => {
    const result = await resultOfATestWith(assert => assert.that(2).isGreaterThanOrEqualTo(2));

    expectSuccess(result);
  })

  test('isGreaterThanOrEqualTo fails if the number is bigger', async () => {
    const result = await resultOfATestWith(assert => assert.that(1).isGreaterThanOrEqualTo(2));

    expectFailureOn(result, I18nMessage.of('expectation_be_greater_than_or_equal', '1', '2'));
  })

  test('isLessThanOrEqualTo passes if the number is strictly bigger', async () => {
    const result = await resultOfATestWith(assert => assert.that(1).isLessThanOrEqualTo(2));

    expectSuccess(result);
  })

  test('isLessThanOrEqualTo passes if the numbers are equal', async () => {
    const result = await resultOfATestWith(assert => assert.that(2).isLessThanOrEqualTo(2));

    expectSuccess(result);
  })

  test('isLessThanOrEqualTo fails if the number is smaller', async () => {
    const result = await resultOfATestWith(assert => assert.that(2).isLessThanOrEqualTo(1));

    expectFailureOn(result, I18nMessage.of('expectation_be_less_than_or_equal', '2', '1'));
  })
});
