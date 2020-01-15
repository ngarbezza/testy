'use strict';

const { suite, test, before, assert } = require('../../testy');
const TestSuite = require('../../lib/test_suite');
const Test = require('../../lib/test');
const { Asserter } = require('../../lib/asserter');
const TestRunner = require('../../lib/test_runner');

const noop = () => {};
const emptyRunnerCallbacks = { onFinish: noop };
const emptySuiteCallbacks = { onStart: noop, onFinish: noop };
const emptyTestCallbacks = {
  whenErrored: noop,
  whenFailed: noop,
  whenPending: noop,
  whenSkipped: noop,
  whenSuccess: noop,
};

const newEmptySuite = () => suiteNamed('myTestSuite');
const suiteNamed = suiteName => new TestSuite(suiteName, () => {}, emptySuiteCallbacks);

suite('test suite behavior', () => {
  let runner, asserter, mySuite;
  let passingTest, failedTest, erroredTest, pendingTest;
  
  before(() => {
    runner = new TestRunner(emptyRunnerCallbacks);
    asserter = new Asserter(runner);
    mySuite = newEmptySuite();
    runner.addSuite(mySuite);
    passingTest = new Test('a pure success', () => asserter.isTrue(true), emptyTestCallbacks);
    failedTest = new Test('a true failure', () => asserter.isFalse(true), emptyTestCallbacks);
    erroredTest = new Test('an unexpected error', () => { throw 'oops' }, emptyTestCallbacks);
    pendingTest = new Test('a work in progress', undefined, emptyTestCallbacks);
  });
  
  test('more than one before block is not allowed', () => {
    mySuite.before(() => 3 + 4);
    
    assert
      .that(() => mySuite.before(() => 5 + 6))
      .raises('There is already a before() block. Please leave just one before() block and run again the tests.');
  });
  
  test('reporting failures and errors', () => {
    mySuite.addTest(passingTest);
    mySuite.addTest(failedTest);
    mySuite.addTest(erroredTest);
    runner.run();

    assert.that(mySuite.allFailuresAndErrors()).includesExactly(failedTest, erroredTest);
  });
  
  test('an empty suite can be executed and it reports zero tests', () => {
    runner.run();
  
    assert.that(mySuite.totalCount()).isEqualTo(0);
  });
  
  test('a suite including a test without body reports it as pending', () => {
    mySuite.addTest(pendingTest);
    runner.run();
  
    assert.that(mySuite.totalCount()).isEqualTo(1);
    assert.that(mySuite.pendingCount()).isEqualTo(1);
  })
});
