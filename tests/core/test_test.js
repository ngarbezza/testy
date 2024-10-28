import { assert, suite, test } from '../../lib/testy.js';
import { aPassingTest, aTestWithBody, aTestWithNoAssertions, aTestRunningFor, aFailingTest } from '../support/tests_factory.js';
import { resultOfASuiteWith, resultOfATestWith, withRunner } from '../support/runner_helpers.js';
import { expectErrorOn, expectFailureOn, expectSuccess } from '../support/assertion_helpers.js';

import { Test } from '../../lib/core/test.js';
import { I18nMessage } from '../../lib/i18n/i18n_messages.js';

suite('tests behavior', () => {
  const noop = async() => {
    // intentionally empty function
  };

  const promiseThatNeverEnds = () => new Promise(() => {});

  test('running a test that does not have any assertion generates an error with a descriptive message', async() => {
    await withRunner(async runner => {
      const testToRun = aTestWithNoAssertions();
      const result = await resultOfASuiteWith(runner, testToRun);

      expectErrorOn(result, 'This test does not have any assertions', /^$/);
    });
  });

  test('a test cannot be created without a name', () => {
    assert.that(() => new Test()).raises(/Test does not have a valid name/);
  });

  test('a test cannot be created with a name that is not a string', () => {
    assert.that(() => new Test(new Date())).raises(/Test does not have a valid name/);
  });

  test('a test can be created with undefined body', () => {
    assert.that(() => new Test('hey', undefined)).doesNotRaise(/Test does not have a valid body/);
  });

  test('a test cannot be created without a body', () => {
    assert.that(() => new Test('hey', null)).raises(/Test does not have a valid body/);
  });

  test('a test cannot be created with a body that is not a function', () => {
    assert.that(() => new Test('hey', 'ho')).raises(/Test does not have a valid body/);
  });

  test('a test cannot be created with an empty name', () => {
    assert.that(() => new Test('   ', undefined)).raises(/Test does not have a valid name/);
  });

  test('a test fails on the first assertion failed', async() => {
    await withRunner(async(runner, asserter) => {
      const failingTest = aTestWithBody(() => {
        asserter.isNotEmpty([]);
        asserter.areEqual(2, 3);
      });

      const result = await resultOfASuiteWith(runner, failingTest);

      expectFailureOn(result, I18nMessage.of('expectation_be_not_empty', '[]'));
    });
  });

  test('a before() hook that fails makes the test fail', async() => {
    await withRunner(async(runner, asserter) => {
      const aTest = aTestWithBody(() => asserter.isEmpty([]));
      const before = () => {
        throw 'oops I did it again';
      };

      const result = await resultOfASuiteWith(runner, aTest, before, noop);

      expectErrorOn(result, 'oops I did it again', '');
    });
  });

  test('an after() hook that fails makes the test fail', async() => {
    await withRunner(async(runner, asserter) => {
      const aTest = aTestWithBody(() => asserter.isEmpty([]));
      const after = () => {
        throw 'oops I did it again';
      };

      const result = await resultOfASuiteWith(runner, aTest, noop, after);

      expectErrorOn(result, 'oops I did it again', '');
    });
  });

  test('a test fails by timeout if it does not finish in the given time', async() => {
    const result = await resultOfATestWith(async() => {
      await promiseThatNeverEnds();
    });

    expectErrorOn(result, I18nMessage.of('reached_timeout_error', 50));
  });

  test('a test does not fail by timeout when previous timeout promise resolves', async() => {
    await withRunner(async(runner, asserter) => {
      const aTest = aTestRunningFor(40, asserter);
      let result = await resultOfASuiteWith(runner, aTest);
      expectSuccess(result);
      result = await resultOfASuiteWith(runner, aTest);
      expectSuccess(result);
    });
  });

  test('a test fails by timeout if the before() block fails by timeout', async() => {
    await withRunner(async(runner, asserter) => {
      const aTest = aPassingTest(asserter);
      const before = async() => {
        await promiseThatNeverEnds();
      };

      const result = await resultOfASuiteWith(runner, aTest, before, noop);

      expectErrorOn(result, I18nMessage.of('reached_timeout_error', 50));
    });
  });

  test('a test fails by timeout if the after() block fails by timeout', async() => {
    await withRunner(async(runner, asserter) => {
      const aTest = aPassingTest(asserter);
      const after = async() => {
        await promiseThatNeverEnds();
      };

      const result = await resultOfASuiteWith(runner, aTest, noop, after);

      expectErrorOn(result, I18nMessage.of('reached_timeout_error', 50));
    });
  });

  test('an explicitly skipped test runs the skipped callback once', async() => {
    await withRunner(async(runner, asserter) => {
      let calls = 0;

      const testToBeSkipped = aFailingTest(
        asserter, { whenSkipped: () => {
          calls += 1;
        } });

      testToBeSkipped.skip();

      const result = await resultOfASuiteWith(runner, testToBeSkipped);

      assert.isTrue(result.isExplicitlySkipped());
      assert.that(calls).isEqualTo(1);
    });
  });

  test('a successful test marked as only runs normally', async() => {
    await withRunner(async(runner, asserter) => {
      let calls = 0;

      const testToBeMarkedAsOnly = aPassingTest(
        asserter, { whenSuccess: () => {
          calls += 1;
        } });

      testToBeMarkedAsOnly.only();

      const result = await resultOfASuiteWith(runner, testToBeMarkedAsOnly);

      assert.isTrue(result.isSuccess());
      assert.that(calls).isEqualTo(1);
    });
  });

  test('a failed test marked as only runs normally', async() => {
    await withRunner(async(runner, asserter) => {
      let calls = 0;

      const testToBeMarkedAsOnly = aFailingTest(
        asserter, { whenFailed: () => {
          calls += 1;
        } });

      testToBeMarkedAsOnly.only();

      const result = await resultOfASuiteWith(runner, testToBeMarkedAsOnly);

      assert.isTrue(result.isFailure());
      assert.that(calls).isEqualTo(1);
    });
  });
});
