'use strict';

const { suite, test, assert } = require('../../testy');
const TestRunner = require('../../lib/test_runner');
const { suiteNamed } = require('../support/suites_factory');
const { withRunner } = require('../support/runner_helpers');
const { aFailingTest } = require('../support/tests_factory');

suite('test runner', () => {
  const emptyRunnerCallbacks = {
    onFinish: () => {},
    onSuccess: () => {},
    onFailure: () => {},
  };
  
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
  
      assert.that(runner.failuresCount()).isEqualTo(1);
    });
  });
});
