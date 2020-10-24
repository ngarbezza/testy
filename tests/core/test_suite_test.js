'use strict';

const { suite, test, before, after, assert } = require('../../testy');
const TestSuite = require('../../lib/test_suite');
const { Asserter } = require('../../lib/asserter');
const TestRunner = require('../../lib/test_runner');
const FailFast = require('../../lib/fail_fast');
const { aPassingTest, aFailingTest, anErroredTest, aPendingTest } = require('../support/tests_factory');

const noop = () => {};
const emptyRunnerCallbacks = { onFinish: noop };
const emptySuiteCallbacks = { onStart: noop, onFinish: noop };

const newEmptySuite = () => suiteNamed('myTestSuite');
const suiteNamed = suiteName => new TestSuite(suiteName, () => {}, emptySuiteCallbacks);

suite('test suite behavior', () => {
  let runner, asserter, mySuite;
  let passingTest, failingTest, erroredTest, pendingTest;
  
  before(() => {
    runner = new TestRunner(emptyRunnerCallbacks);
    asserter = new Asserter(runner);
    mySuite = newEmptySuite();
    runner.addSuite(mySuite);
    passingTest = aPassingTest(asserter);
    failingTest = aFailingTest(asserter);
    erroredTest = anErroredTest();
    pendingTest = aPendingTest();
  });

  after(() => {
    runner = undefined;
    asserter = undefined;
    mySuite = undefined;
    passingTest = undefined;
    failingTest = undefined;
    erroredTest = undefined;
    pendingTest = undefined;
  });
  
  test('more than one before block is not allowed', () => {
    mySuite.before(() => 3 + 4);
    
    assert
      .that(() => mySuite.before(() => 5 + 6))
      .raises('There is already a before() block. Please leave just one before() block and run again the tests.');
  });
  
  test('more than one after block is not allowed', () => {
    mySuite.after(() => 3 + 4);
    
    assert
      .that(() => mySuite.after(() => 5 + 6))
      .raises('There is already an after() block. Please leave just one after() block and run again the tests.');
  });

  test('after hook can be used', () => {
    let afterTestVar = 10;

    mySuite.before(() => {
      afterTestVar = 9;
    });
    mySuite.after(() => {
      afterTestVar = 0;
    });
    mySuite.addTest(passingTest);
    runner.run();
    assert.that(afterTestVar).isEqualTo(0);
  });

  test('reporting failures and errors', () => {
    mySuite.addTest(passingTest);
    mySuite.addTest(failingTest);
    mySuite.addTest(erroredTest);
    runner.run();

    assert.that(mySuite.allFailuresAndErrors()).includesExactly(failingTest, erroredTest);
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
  });
  
  test('a suite cannot be created without a name', () => {
    assert.that(() => new TestSuite()).raises('Suite does not have a valid name');
  });

  test('a suite cannot be created with name empty', () => {
    assert.that(() => new TestSuite('')).raises('Suite and test names cannot be empty');
  });
  
  test('a suite cannot be created with a name that is not a string', () => {
    assert.that(() => new TestSuite(new Date())).raises('Suite does not have a valid name');
  });
  
  test('a suite cannot be created without a body', () => {
    assert.that(() => new TestSuite('hey')).raises('Suite does not have a valid body');
  });
  
  test('a suite cannot be created with a body that is not a function', () => {
    assert.that(() => new TestSuite('hey', 'ho')).raises('Suite does not have a valid body');
  });
  
  test('running with fail fast enabled stops at the first failure', () => {
    mySuite.addTest(passingTest);
    mySuite.addTest(failingTest);
    mySuite.addTest(erroredTest);
    mySuite.addTest(pendingTest);
    runner.setFailFastMode(FailFast.enabled());
    
    runner.run();
    
    assert.isTrue(passingTest.isSuccess());
    assert.isTrue(failingTest.isFailure());
    assert.isTrue(erroredTest.isSkipped());
    assert.isTrue(pendingTest.isSkipped());
  });
});
