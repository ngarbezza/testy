'use strict';

const { suite, test, assert } = require('../../testy');
const TestRunner = require('../../lib/test_runner');

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
      }
    };
    const runner = new TestRunner(callbacks);
  
    runner.run();
    runner.finish();
    
    assert.isTrue(finished);
    assert.that(result).isEqualTo('success');
  });
});
