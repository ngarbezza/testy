'use strict';

const { suite, test, assert } = require('../../testy');
const TestRunner = require('../../lib/test_runner');
const { withRunner } = require('../support/runner_helpers');
const { suiteNamed } = require('../support/suites_factory');
const { aFailingTest, anErroredTest } = require('../support/tests_factory');

suite('test runner', () => {
  test('with no tests, it finishes with success', async() => {
    let result = 'not called';
    let finished = false;
    const callbacks = {
      onFinish: () => {
        finished = true;
      },
      onSuccess: () => {
        result = 'success';
      },
      onFailure: () => {
        result = 'failure';
      },
    };
    const runner = new TestRunner(callbacks);

    await runner.run();
    runner.finish();

    assert.isTrue(finished);
    assert.that(result).isEqualTo('success');
  });

  test('failures count is zero with no tests', async() => {
    await withRunner(async runner => {
      await runner.run();

      assert.isFalse(runner.hasErrorsOrFailures());
      assert.isEmpty(runner.allFailuresAndErrors());
      assert.that(runner.failuresCount()).isEqualTo(0);
    });
  });

  test('failures count is one with one failed test', async() => {
    await withRunner(async(runner, asserter) => {
      const suiteWithAFailure = suiteNamed('with one failure');
      const failingTest = aFailingTest(asserter);
      suiteWithAFailure.addTest(failingTest);
      runner.addSuite(suiteWithAFailure);
      await runner.run();

      assert.isTrue(runner.hasErrorsOrFailures());
      assert.that(runner.failuresCount()).isEqualTo(1);
      assert.that(runner.allFailuresAndErrors()).includesExactly(failingTest);
    });
  });

  test('errors count is zero with no tests', async() => {
    await withRunner(async runner => {
      await runner.run();

      assert.isFalse(runner.hasErrorsOrFailures());
      assert.isEmpty(runner.allFailuresAndErrors());
      assert.that(runner.errorsCount()).isEqualTo(0);
    });
  });

  test('errors count is one with an errored test', async() => {
    await withRunner(async(runner, asserter) => {
      const suiteWithAnError = suiteNamed('with one error');
      const erroredTest = anErroredTest(asserter);
      suiteWithAnError.addTest(erroredTest);
      runner.addSuite(suiteWithAnError);
      await runner.run();

      assert.isTrue(runner.hasErrorsOrFailures());
      assert.that(runner.errorsCount()).isEqualTo(1);
      assert.that(runner.allFailuresAndErrors()).includesExactly(erroredTest);
    });
  });

  test('counting several errors and failures', async() => {
    await withRunner(async(runner, asserter) => {
      const suiteWithAErrorsAndFailures = suiteNamed('with errors and failures');
      const errorOne = anErroredTest(asserter);
      const errorTwo = anErroredTest(asserter);
      const errorThree = anErroredTest(asserter);
      const failureOne = aFailingTest(asserter);
      const failureTwo = aFailingTest(asserter);
      suiteWithAErrorsAndFailures.addTest(errorOne);
      suiteWithAErrorsAndFailures.addTest(failureOne);
      suiteWithAErrorsAndFailures.addTest(errorTwo);
      suiteWithAErrorsAndFailures.addTest(errorThree);
      suiteWithAErrorsAndFailures.addTest(failureTwo);
      runner.addSuite(suiteWithAErrorsAndFailures);
      await runner.run();

      assert.that(runner.errorsCount()).isEqualTo(3);
      assert.that(runner.failuresCount()).isEqualTo(2);
      assert.isTrue(runner.hasErrorsOrFailures());
      assert.that(runner.allFailuresAndErrors()).includesExactly(errorOne, errorTwo, errorThree, failureOne, failureTwo);
    });
  });
});
