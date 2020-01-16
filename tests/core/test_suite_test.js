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
const newTest = (name, body) => new Test(name, body, emptyTestCallbacks);

suite('test suite behavior', () => {
  let runner, asserter, mySuite;
  let passingTest, failedTest, erroredTest, pendingTest, passingAsyncTest, failedAsyncTest, erroredAsyncTest;
  
  before(() => {
    runner = new TestRunner(emptyRunnerCallbacks);
    asserter = new Asserter(runner);
    mySuite = newEmptySuite();
    runner.addSuite(mySuite);
    passingTest = newTest('a pure success', () => asserter.isTrue(true));
    failedTest = newTest('a true failure', () => asserter.isFalse(true));
    erroredTest = newTest('an unexpected error', () => { throw 'oops' });
    pendingTest = newTest('a work in progress', undefined);
    passingAsyncTest = newTest('an async test that fails', () => Promise.resolve().then(() => asserter.isTrue(true)));
    failedAsyncTest = newTest('an async test that fails', () => Promise.resolve().then(() => asserter.isTrue(false)));
    erroredAsyncTest = newTest('an async test that errors', () => Promise.resolve().then(() => { throw 'oops' }));
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

    return runner.run().then(() => {
      assert.that(mySuite.allFailuresAndErrors()).includesExactly(failedTest, erroredTest);
    });
  });
  
  test('reporting failures and errors of async tests', () => {
    mySuite.addTest(passingAsyncTest);
    mySuite.addTest(failedAsyncTest);
    mySuite.addTest(erroredAsyncTest);

    return runner.run().then(() => {
      assert.that(mySuite.allFailuresAndErrors()).includesExactly(failedAsyncTest, erroredAsyncTest);
    });
  });

  test('it is possible to have an async before block', () => {
    let beforeExecuted = false;
    mySuite.before(() => Promise.resolve().then(() => { beforeExecuted = true; }));
    mySuite.addTest(
      newTest(
        'before is executed',
        () => { asserter.isTrue(beforeExecuted) }
      )
    );

    return runner.run().then(() => {
      assert.that(mySuite.successCount()).isEqualTo(1);
    });
  });

  test('an empty suite can be executed and it reports zero tests', () => {
    return runner.run().then(() => {
      assert.that(mySuite.totalCount()).isEqualTo(0);
    });
  });
  
  test('a suite including a test without body reports it as pending', () => {
    mySuite.addTest(pendingTest);

    return runner.run().then(() => {
      assert.that(mySuite.totalCount()).isEqualTo(1);
      assert.that(mySuite.pendingCount()).isEqualTo(1);
    });
  });
});
