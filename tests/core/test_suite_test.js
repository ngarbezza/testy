'use strict';

const { suite, test, before, assert } = require('../../testy');
const TestSuite = require('../../lib/test_suite');
const { withRunner } = require('../support/runner_helpers');
const FailFast = require('../../lib/fail_fast');
const { aPassingTest, aFailingTest, anErroredTest, aPendingTest } = require('../support/tests_factory');

const noop = () => {};
const emptySuiteCallbacks = { onStart: noop, onFinish: noop };

const newEmptySuite = () => suiteNamed('myTestSuite');
const suiteNamed = suiteName => new TestSuite(suiteName, () => {}, emptySuiteCallbacks);

suite('test suite behavior', () => {
  let runner, mySuite;
  let passingTest, failingTest, erroredTest, pendingTest;
  
  before(() => {
    withRunner((runnerToUse, asserterToUse) => {
      runner = runnerToUse;
      mySuite = newEmptySuite();
      runner.addSuite(mySuite);
      passingTest = aPassingTest(asserterToUse);
      failingTest = aFailingTest(asserterToUse);
      erroredTest = anErroredTest();
      pendingTest = aPendingTest();
    });
  });
  
  test('more than one before block is not allowed', () => {
    mySuite.before(() => 3 + 4);
    
    assert
      .that(() => mySuite.before(() => 5 + 6))
      .raises(/There is already a before\(\) block. Please leave just one before\(\) block and run again the tests./);
  });
  
  test('more than one after block is not allowed', () => {
    mySuite.after(() => 3 + 4);
    
    assert
      .that(() => mySuite.after(() => 5 + 6))
      .raises(/There is already an after\(\) block. Please leave just one after\(\) block and run again the tests./);
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
    assert.that(() => new TestSuite()).raises(/Suite does not have a valid name/);
  });

  test('a suite cannot be created with an empty name', () => {
    assert.that(() => new TestSuite('  ')).raises(/Suite does not have a valid name/);
  });
  
  test('a suite cannot be created with a name that is not a string', () => {
    assert.that(() => new TestSuite(new Date())).raises(/Suite does not have a valid name/);
  });
  
  test('a suite cannot be created without a body', () => {
    assert.that(() => new TestSuite('hey')).raises(/Suite does not have a valid body/);
  });
  
  test('a suite cannot be created with a body that is not a function', () => {
    assert.that(() => new TestSuite('hey', 'ho')).raises(/Suite does not have a valid body/);
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
  
  test('tests can be randomized based on a setting', () => {
    mySuite.addTest(passingTest);
    mySuite.addTest(failingTest);
    mySuite.addTest(erroredTest);
    mySuite.addTest(pendingTest);
    runner.setTestRandomness(true);
    
    const testsBefore = mySuite.tests();
    runner.run();
    const testsAfter = mySuite.tests();
    
    // we cannot test how the random process was done, but at least we ensure we keep the same tests
    assert.areEqual(new Set(testsBefore), new Set(testsAfter));
  });
});
