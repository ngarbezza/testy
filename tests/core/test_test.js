'use strict';

const { suite, test, assert } = require('../../testy');
const { aTestWithNoAssertions, aTestWithBody } = require('../support/tests_factory');
const { withRunner, runSingleTest, resultOfASuiteWith } = require('../support/runner_helpers');
const { expectErrorOn, expectFailureOn } = require('../support/assertion_helpers');

const Test = require('../../lib/test');
const { I18nMessage } = require('../../lib/i18n');

suite('tests behavior', () => {
  const noop = () => {
    // intentionally empty function
  };

  test('running a test that does not have any assertion generates an error with a descriptive message', async() => {
    await withRunner(async runner => {
      const testToRun = aTestWithNoAssertions();
      const result = await runSingleTest(runner, testToRun);

      expectErrorOn(result, 'This test does not have any assertions', '');
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
      const test = aTestWithBody(() => {
        asserter.isNotEmpty([]);
        asserter.areEqual(2, 3);
      });

      const result = await runSingleTest(runner, test);

      expectFailureOn(result, I18nMessage.of('expectation_be_not_empty', '[]'));
    });
  });

  test('a before() hook that fails makes the test fail', async() => {
    await withRunner(async(runner, asserter) => {
      const test = aTestWithBody(() => asserter.isEmpty([]));
      const before = () => {
        throw 'oops I did it again';
      };

      const result = await resultOfASuiteWith(runner, test, before, noop);

      expectErrorOn(result, 'oops I did it again', '');
    });
  });

  test('an after() hook that fails makes the test fail', async() => {
    await withRunner(async(runner, asserter) => {
      const test = aTestWithBody(() => asserter.isEmpty([]));
      const after = () => {
        throw 'oops I did it again';
      };

      const result = await resultOfASuiteWith(runner, test, noop, after);

      expectErrorOn(result, 'oops I did it again', '');
    });
  });
});
