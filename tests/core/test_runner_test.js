'use strict';

const { suite, test, assert } = require('../../testy');
const TestRunner = require('../../lib/test_runner');
const { withRunner } = require('../support/runner_helpers');
const { suiteNamed } = require('../support/suites_factory');
const { aFailingTest, anErroredTest } = require('../support/tests_factory');

suite('test runner', () => {
  test('with no tests, it finishes with success', () => {
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
  
    runner.run();
    runner.finish();
    
    assert.isTrue(finished);
    assert.that(result).isEqualTo('success');
  });
  
  test('failures count is zero with no tests', () => {
    withRunner(runner => {
      runner.run();
  
      assert.isFalse(runner.hasErrorsOrFailures());
      assert.isEmpty(runner.allFailuresAndErrors());
      assert.that(runner.failuresCount()).isEqualTo(0);
    });
  });
  
  test('failures count is one with one failed test', () => {
    withRunner((runner, asserter) => {
      const suite = suiteNamed('with one failure');
      const failingTest = aFailingTest(asserter);
      suite.addTest(failingTest);
      runner.addSuite(suite);
      runner.run();
  
      assert.isTrue(runner.hasErrorsOrFailures());
      assert.that(runner.failuresCount()).isEqualTo(1);
      assert.that(runner.allFailuresAndErrors()).includesExactly(failingTest);
    });
  });
  
  test('errors count is zero with no tests', () => {
    withRunner(runner => {
      runner.run();
  
      assert.isFalse(runner.hasErrorsOrFailures());
      assert.isEmpty(runner.allFailuresAndErrors());
      assert.that(runner.errorsCount()).isEqualTo(0);
    });
  });
  
  test('errors count is one with an errored test', () => {
    withRunner((runner, asserter) => {
      const suite = suiteNamed('with one error');
      const erroredTest = anErroredTest(asserter);
      suite.addTest(erroredTest);
      runner.addSuite(suite);
      runner.run();
  
      assert.isTrue(runner.hasErrorsOrFailures());
      assert.that(runner.errorsCount()).isEqualTo(1);
      assert.that(runner.allFailuresAndErrors()).includesExactly(erroredTest);
    });
  });
  
  test('counting several errors and failures', () => {
    withRunner((runner, asserter) => {
      const suite = suiteNamed('with errors and failures');
      const errorOne = anErroredTest(asserter);
      const errorTwo = anErroredTest(asserter);
      const errorThree = anErroredTest(asserter);
      const failureOne = aFailingTest(asserter);
      const failureTwo = aFailingTest(asserter);
      suite.addTest(errorOne);
      suite.addTest(failureOne);
      suite.addTest(errorTwo);
      suite.addTest(errorThree);
      suite.addTest(failureTwo);
      runner.addSuite(suite);
      runner.run();
      
      assert.that(runner.errorsCount()).isEqualTo(3);
      assert.that(runner.failuresCount()).isEqualTo(2);
      assert.isTrue(runner.hasErrorsOrFailures());
      assert.that(runner.allFailuresAndErrors()).includesExactly(errorOne, errorTwo, errorThree, failureOne, failureTwo);
    });
  });
});
