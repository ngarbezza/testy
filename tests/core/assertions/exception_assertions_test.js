'use strict';

const { suite, test } = require('../../../lib/testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectSuccess, expectFailureOn } = require('../../support/assertion_helpers');

const { I18nMessage } = require('../../../lib/i18n/i18n');

suite('exception assertions', () => {
  test('raises() can receive a string and it passes when the exact string is expected', async() => {
    const result = await resultOfATestWith(assert =>
      assert.that(() => {
        throw 'an error happened';
      }).raises('an error happened'),
    );

    expectSuccess(result);
  });

  test('raises() can receive a regex and it passes when it matches the thrown string', async() => {
    const result = await resultOfATestWith(assert =>
      assert.that(() => {
        throw 'an error happened';
      }).raises(/error/),
    );

    expectSuccess(result);
  });

  test('raises() can receive an arbitrary object and it passes when the exact object is expected', async() => {
    const result = await resultOfATestWith(assert =>
      assert.that(() => {
        throw { an: 'object' };
      }).raises({ an: 'object' }),
    );

    expectSuccess(result);
  });

  test('raises() can receive a regex and it passes when it matches the thrown error with message', async() => {
    const result = await resultOfATestWith(assert =>
      assert.that(() => {
        throw new Error('things happened');
      }).raises(/happened/),
    );

    expectSuccess(result);
  });

  test('raises() can receive a regex and it fails if there is not a match in the error message', async() => {
    const result = await resultOfATestWith(assert =>
      assert.that(() => {
        throw 'a terrible error';
      }).raises(/happiness/),
    );

    expectFailureOn(result, I18nMessage.of('expectation_different_error', '/happiness/', "'a terrible error'"));
  });

  test('raises() fails when no errors occur in the given function', async() => {
    const result = await resultOfATestWith(assert => assert.that(() => 1 + 2).raises('a weird error'));

    expectFailureOn(result, I18nMessage.of('expectation_error', "'a weird error'"));
  });

  test('doesNotRaise() passes when no errors happen at all', async() => {
    const result = await resultOfATestWith(assert => assert.that(() => 1 + 2).doesNotRaise('a problem'));

    expectSuccess(result);
  });

  test('doesNotRaise() passes when another error happens that do not match the expected one', async() => {
    const result = await resultOfATestWith(assert =>
      assert.that(() => {
        throw 'another problem';
      }).doesNotRaise('a problem'),
    );

    expectSuccess(result);
  });

  test('doesNotRaise() fails when the expected error happens during the execution of the test', async() => {
    const result = await resultOfATestWith(assert =>
      assert.that(() => {
        throw 'this problem';
      }).doesNotRaise('this problem'),
    );

    expectFailureOn(result, I18nMessage.of('expectation_no_error', "'this problem'"));
  });

  test('doesNoRaiseAnyErrors() passes when no errors occur in the given function', async() => {
    const result = await resultOfATestWith(assert => assert.that(() => 1 + 2).doesNotRaiseAnyErrors());

    expectSuccess(result);
  });

  test('doesNoRaiseAnyErrors() fails when an error happens', async() => {
    const result = await resultOfATestWith(assert =>
      assert.that(() => {
        throw 'an unexpected error';
      }).doesNotRaiseAnyErrors(),
    );

    expectFailureOn(result, I18nMessage.of('expectation_no_errors', "'an unexpected error'"));
  });
});
