import { suite, test } from '../../../lib/testy.js';
import { resultOfATestWith } from '../../support/runner_helpers.js';
import { expectSuccess, expectFailureOn, expectErrorOn } from '../../support/assertion_helpers.js';

import { I18nMessage } from '../../../lib/i18n/i18n_messages.js';

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

  test('raises() returns an assertion invalid error if the actual object is not a function', async() => {
    const result = await resultOfATestWith(assert => assert.that('hello').raises('a weird error'));

    expectErrorOn(result, I18nMessage.of('invalid_actual_object_in_exception_assertion', "'hello'"), '');
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

  test('doesNotRaise() returns an assertion invalid error if the actual object is not a function', async() => {
    const result = await resultOfATestWith(assert => assert.that('hello').doesNotRaise('a weird error'));

    expectErrorOn(result, I18nMessage.of('invalid_actual_object_in_exception_assertion', "'hello'"), '');
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

  test('doesNoRaiseAnyErrors() returns an assertion invalid error if the actual object is not a function', async() => {
    const result = await resultOfATestWith(assert => assert.that('hello').doesNotRaiseAnyErrors());

    expectErrorOn(result, I18nMessage.of('invalid_actual_object_in_exception_assertion', "'hello'"), '');
  });
});
