'use strict';

const { suite, test, assert } = require('../../testy');
const { aTestWithNoAssertions, aTestWithBody } = require('../support/tests_factory');
const { withRunner, runSingleTest } = require('../support/runner_helpers');
const { expectErrorOn, expectFailureOn } = require('../support/assertion_helpers');

const Test = require('../../lib/test');
const { I18nMessage } = require('../../lib/i18n');

suite('tests behavior', () => {
  test('running a test that does not have any assertion generates an error with a descriptive message', async() => {
    await withRunner(async runner => {
      const testToRun = aTestWithNoAssertions();
      const result = await runSingleTest(runner, testToRun);

      expectErrorOn(result, 'This test does not have any assertions');
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
    await withRunner(async(runner, assert) => {
      const test = aTestWithBody(() => {
        assert.isNotEmpty([]);
        assert.areEqual(2, 3);
      });

      const result = await runSingleTest(runner, test);

      expectFailureOn(result, I18nMessage.of('expectation_be_not_empty', '[]'));
    });
  });
});
