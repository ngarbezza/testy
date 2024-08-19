'use strict';

import { assert, before, suite, test } from '../../lib/testy.js';
import { withRunner } from '../support/runner_helpers.js';
import { newEmptySuite } from '../support/suites_factory.js';
import { aFailingTest, anErroredTest, aPassingTest, aPendingTest } from '../support/tests_factory.js';

import { TestSuite } from '../../lib/core/test_suite.js';
import { FailFast } from '../../lib/config/fail_fast.js';

suite('test suite behavior', () => {
  let runner, mySuite;
  let passingTest, failingTest, erroredTest, pendingTest;

  before(async() => {
    await withRunner((runnerToUse, asserterToUse) => {
      runner = runnerToUse;
      mySuite = newEmptySuite();
      runner.addSuite(mySuite);
      passingTest = aPassingTest(asserterToUse);
      failingTest = aFailingTest(asserterToUse);
      erroredTest = anErroredTest();
      pendingTest = aPendingTest();
    });
  });

  test('it is possible to retrieve the suite name', () => {
    const suite = new TestSuite('my cool behavior', () => {});

    assert.that(suite.name()).isEqualTo('my cool behavior');
  });

  test('more than one before block is not allowed', () => {
    mySuite.before(() => 3 + 4);

    assert
      .that(() => mySuite.before(() => 5 + 6))
      .raises(new Error('There is already a before() block. Please leave just one before() block and run again the tests.'));
  });

  test('a before() hook with no function is considered invalid', () => {
    assert
      .that(() => mySuite.before())
      .raises(new Error('The before() hook must include a function. Please provide a function or remove the before() and run again the tests.'));
  });

  test('more than one after block is not allowed', () => {
    mySuite.after(() => 3 + 4);

    assert
      .that(() => mySuite.after(() => 5 + 6))
      .raises(new Error('There is already a after() block. Please leave just one after() block and run again the tests.'));
  });

  test('a after() hook with no function is considered invalid', () => {
    assert
      .that(() => mySuite.after())
      .raises(new Error('The after() hook must include a function. Please provide a function or remove the after() and run again the tests.'));
  });

  test('before() and after() hooks are executed in the right order', async() => {
    const hookExecutions = ['start'];

    mySuite.before(() => {
      hookExecutions.push('before');
    });
    mySuite.after(() => {
      hookExecutions.push('after');
    });
    mySuite.addTest(passingTest);
    await runner.run();

    assert.that(hookExecutions).includesExactly('start', 'before', 'after');
  });

  test('before() and after() on their asynchronous versions are executed in the right order', async() => {
    const hookExecutions = ['start'];

    mySuite.before(async() => {
      Promise.resolve('before').then(value => hookExecutions.push(value));
    });
    mySuite.after(async() => {
      Promise.resolve('after').then(value => hookExecutions.push(value));
    });
    mySuite.addTest(passingTest);
    await runner.run();

    assert.that(hookExecutions).includesExactly('start', 'before', 'after');
  });

  test('before() and after() hooks are executed once per test, no matter the result of each test', async() => {
    const hookExecutions = ['start'];

    mySuite.before(() => {
      hookExecutions.push('before');
    });
    mySuite.after(() => {
      hookExecutions.push('after');
    });
    mySuite.addTest(passingTest);
    mySuite.addTest(failingTest);
    mySuite.addTest(erroredTest);
    await runner.run();

    assert.that(hookExecutions).includesExactly('start', 'before', 'after', 'before', 'after', 'before', 'after');
  });

  test('reporting failures and errors', async() => {
    mySuite.addTest(passingTest);
    mySuite.addTest(failingTest);
    mySuite.addTest(erroredTest);
    await runner.run();

    assert.that(mySuite.allFailuresAndErrors()).includesExactly(failingTest, erroredTest);
  });

  test('an empty suite can be executed and it reports zero tests', async() => {
    await runner.run();

    assert.that(mySuite.totalCount()).isEqualTo(0);
  });

  test('a suite including a test without body reports it as pending', async() => {
    mySuite.addTest(pendingTest);
    await runner.run();

    assert.that(mySuite.totalCount()).isEqualTo(1);
    assert.that(mySuite.pendingCount()).isEqualTo(1);
    assert.that(mySuite.successCount()).isEqualTo(0);
    assert.that(mySuite.failuresCount()).isEqualTo(0);
    assert.that(mySuite.errorsCount()).isEqualTo(0);
    assert.that(mySuite.skippedCount()).isEqualTo(0);
  });

  test('a suite cannot be created without a name', () => {
    assert
      .that(() => new TestSuite())
      .raises(new Error('Suite does not have a valid name. Please enter a non-empty string to name this suite.'));
  });

  test('a suite cannot be created with an empty name', () => {
    assert
      .that(() => new TestSuite('  '))
      .raises(new Error('Suite does not have a valid name. Please enter a non-empty string to name this suite.'));
  });

  test('a suite cannot be created with a name that is not a string', () => {
    assert
      .that(() => new TestSuite(new Date()))
      .raises(new Error('Suite does not have a valid name. Please enter a non-empty string to name this suite.'));
  });

  test('a suite cannot be created without a body', () => {
    assert
      .that(() => new TestSuite('hey'))
      .raises(new Error('Suite does not have a valid body. Please provide a function to declare the suite body.'));
  });

  test('a suite cannot be created with a body that is not a function', () => {
    assert
      .that(() => new TestSuite('hey', 'ho'))
      .raises(new Error('Suite does not have a valid body. Please provide a function to declare the suite body.'));
  });

  test('running with fail fast enabled stops at the first failure', async() => {
    mySuite.addTest(passingTest);
    mySuite.addTest(failingTest);
    mySuite.addTest(erroredTest);
    mySuite.addTest(pendingTest);
    runner.setFailFastMode(FailFast.enabled());

    await runner.run();

    assert.isTrue(passingTest.isSuccess());
    assert.isTrue(failingTest.isFailure());
    assert.isTrue(erroredTest.isSkipped());
    assert.isTrue(pendingTest.isSkipped());

    assert.areEqual(mySuite.skippedCount(), 2);
  });

  test('tests can be randomized based on a setting', async() => {
    mySuite.addTest(passingTest);
    mySuite.addTest(failingTest);
    mySuite.addTest(erroredTest);
    mySuite.addTest(pendingTest);
    runner.setTestRandomness(true);

    const testsBefore = mySuite.tests();
    await runner.run();
    const testsAfter = mySuite.tests();

    // we cannot test how the random process was done, but at least we ensure we keep the same tests
    assert.areEqual(new Set(testsBefore), new Set(testsAfter));
  });
});
