'use strict';

const { suite, test, assert } = require('../../testy');
const TestSuite = require('../../lib/test_suite');
const Test = require('../../lib/test');
const { Asserter } = require('../../lib/asserter');
const TestRunner = require('../../lib/test_runner');

const noop = () => {};
const emptyRunnerCallbacks = { onFinish: noop };
const emptySuiteCallbacks = { onFinish: noop };
const emptyTestCallbacks = {
  whenErrored: noop,
  whenFailed: noop,
  whenPending: noop,
  whenSkipped: noop,
  whenSuccess: noop,
};

function newEmptySuite() {
  return suiteNamed('myTestSuite');
}

function suiteNamed(suiteName) {
  return new TestSuite(suiteName, () => {}, emptySuiteCallbacks);
}

suite('test suite behavior', () => {
  test('more than one before block is not allowed', () => {
    const mySuite = newEmptySuite();
    mySuite.before(() => 3 + 4);
    
    assert
      .that(() => mySuite.before(() => 5 + 6))
      .raises('There is already a before() block. Please leave just one before() block and run again the tests.');
  });
  
  test('reporting failures and errors', () => {
    const runner = new TestRunner(emptyRunnerCallbacks);
    const asserter = new Asserter(runner);
  
    const passingTest = new Test('a pure success', () => asserter.isTrue(true), emptyTestCallbacks);
    const failedTest = new Test('a true failure', () => asserter.isFalse(true), emptyTestCallbacks);
    const erroredTest = new Test('an unexpected error', () => { throw 'oops' }, emptyTestCallbacks);
    
    const mySuite = newEmptySuite();
    mySuite.addTest(passingTest);
    mySuite.addTest(failedTest);
    mySuite.addTest(erroredTest);
    runner.addSuite(mySuite);
    runner.run();

    assert.that(mySuite.allFailuresAndErrors()).includesExactly(failedTest, erroredTest);
  });
});
