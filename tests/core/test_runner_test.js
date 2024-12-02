import { assert, suite, test } from '../../lib/testy.js';
import { withRunner } from '../support/runner_helpers.js';
import { emptySuiteBody, emptySuiteCallbacks, fakePathLocation, suiteNamed } from '../support/suites_factory.js';
import { aFailingTest, anErroredTest, aPassingTest, anExplicitlySkippedTest, emptyTestCallbacks } from '../support/tests_factory.js';

import { TestRunner } from '../../lib/core/test_runner.js';

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

    assert.isTrue(finished);
    assert.that(result).isEqualTo('success');
  });

  test('with a failure, it finishes with failure', async() => {
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
    runner.loadingFile(fakePathLocation);
    runner.registerSuite('failing suite', emptySuiteBody, emptySuiteCallbacks, fakePathLocation);
    runner.registerTest('failing test', () => {
      throw new Error('oops');
    }, emptyTestCallbacks);

    await runner.run();

    assert.isTrue(finished);
    assert.that(result).isEqualTo('failure');
  });

  test('counters report zero on an empty suite', async() => {
    await withRunner(async runner => {
      await runner.run();

      assert.that(runner.totalCount()).isEqualTo(0);
      assert.that(runner.successCount()).isEqualTo(0);
      assert.that(runner.failuresCount()).isEqualTo(0);
      assert.that(runner.errorsCount()).isEqualTo(0);
      assert.that(runner.pendingCount()).isEqualTo(0);
      assert.that(runner.skippedCount()).isEqualTo(0);
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
      assert.that(runner.totalCount()).isEqualTo(1);
      assert.that(runner.failuresCount()).isEqualTo(1);
      assert.that(runner.errorsCount()).isEqualTo(0);
      assert.that(runner.successCount()).isEqualTo(0);
      assert.that(runner.pendingCount()).isEqualTo(0);
      assert.that(runner.skippedCount()).isEqualTo(0);
      assert.that(runner.allFailuresAndErrors()).includesExactly(failingTest);
    });
  });

  test('counters report many successful tests', async() => {
    await withRunner(async(runner, asserter) => {
      const successfulSuite = suiteNamed('with 2 successful tests');
      const passingTestOne = aPassingTest(asserter);
      const passingTestTwo = aPassingTest(asserter);
      successfulSuite.addTest(passingTestOne);
      successfulSuite.addTest(passingTestTwo);
      runner.addSuite(successfulSuite);
      await runner.run();

      assert.that(runner.totalCount()).isEqualTo(2);
      assert.that(runner.successCount()).isEqualTo(2);
      assert.that(runner.failuresCount()).isEqualTo(0);
      assert.that(runner.errorsCount()).isEqualTo(0);
      assert.that(runner.pendingCount()).isEqualTo(0);
      assert.that(runner.skippedCount()).isEqualTo(0);
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
      assert.that(runner.totalCount()).isEqualTo(1);
      assert.that(runner.errorsCount()).isEqualTo(1);
      assert.that(runner.failuresCount()).isEqualTo(0);
      assert.that(runner.successCount()).isEqualTo(0);
      assert.that(runner.pendingCount()).isEqualTo(0);
      assert.that(runner.skippedCount()).isEqualTo(0);
      assert.that(runner.allFailuresAndErrors()).includesExactly(erroredTest);
    });
  });

  test('explicitly skipped count is one with an explicitly skipped test', async() => {
    await withRunner(async(runner, asserter) => {

      const suiteWithAnExplicitlySkippedTest = suiteNamed('with one explicitly skipped test');

      const explicitlySkippedTest = anExplicitlySkippedTest(asserter);
      suiteWithAnExplicitlySkippedTest.addTest(explicitlySkippedTest);
      runner.addSuite(suiteWithAnExplicitlySkippedTest);
      await runner.run();

      assert.that(runner.totalCount()).isEqualTo(1);
      assert.that(runner.errorsCount()).isEqualTo(0);
      assert.that(runner.failuresCount()).isEqualTo(0);
      assert.that(runner.successCount()).isEqualTo(0);
      assert.that(runner.pendingCount()).isEqualTo(0);
      assert.that(runner.skippedCount()).isEqualTo(1);
    });
  });

  test('counting several errors, failures and explicitly skipped test', async() => {
    await withRunner(async(runner, asserter) => {
      const suiteWithAErrorsAndFailuresAndSkipped = suiteNamed('with errors, failures and skipped');
      const errorOne = anErroredTest(asserter);
      const errorTwo = anErroredTest(asserter);
      const errorThree = anErroredTest(asserter);
      const failureOne = aFailingTest(asserter);
      const failureTwo = aFailingTest(asserter);
      const explicitlySkippedTest = anExplicitlySkippedTest(asserter);
      suiteWithAErrorsAndFailuresAndSkipped.addTest(explicitlySkippedTest);
      suiteWithAErrorsAndFailuresAndSkipped.addTest(errorOne);
      suiteWithAErrorsAndFailuresAndSkipped.addTest(failureOne);
      suiteWithAErrorsAndFailuresAndSkipped.addTest(errorTwo);
      suiteWithAErrorsAndFailuresAndSkipped.addTest(errorThree);
      suiteWithAErrorsAndFailuresAndSkipped.addTest(failureTwo);
      runner.addSuite(suiteWithAErrorsAndFailuresAndSkipped);
      await runner.run();

      assert.that(runner.totalCount()).isEqualTo(6);
      assert.that(runner.failuresCount()).isEqualTo(2);
      assert.that(runner.errorsCount()).isEqualTo(3);
      assert.that(runner.successCount()).isEqualTo(0);
      assert.that(runner.pendingCount()).isEqualTo(0);
      assert.that(runner.skippedCount()).isEqualTo(1);
      assert.isTrue(runner.hasErrorsOrFailures());
      assert.that(runner.allFailuresAndErrors()).includesExactly(errorOne, errorTwo, errorThree, failureOne, failureTwo);
    });
  });

  test('can create suites and tests by itself', async() => {
    await withRunner(async(runner, asserter) => {
      runner.loadingFile(fakePathLocation);
      runner.registerSuite('my new suite', emptySuiteBody, emptySuiteCallbacks, fakePathLocation);
      const testBody = () => {
        asserter.that(3 + 4).isEqualTo(7);
      };
      runner.registerTest('3 plus 4 is 7', testBody, emptyTestCallbacks);
      await runner.run();

      assert.that(runner.totalCount()).isEqualTo(1);
      assert.that(runner.successCount()).isEqualTo(1);
    });
  });
});
