'use strict';

const { TestRunner } = require('../../lib/core/test_runner');
const { TestSuite } = require('../../lib/core/test_suite');
const { Asserter, FailureGenerator, PendingMarker } = require('../../lib/core/asserter');
const { aTestWithBody } = require('./tests_factory');

const noop = () => {
  // intentionally empty function
};

const runSingleTest = async(runner, test) => {
  const emptySuiteCallbacks = { onStart: noop, onFinish: noop };
  const suite = new TestSuite(`suite for ${test.name()}`, noop, emptySuiteCallbacks);
  suite.addTest(test);
  runner.addSuite(suite);
  await runner.run();
  return test.result();
};

const withRunner = async testBlock => {
  const emptyRunnerCallbacks = { onFailure: noop, onSuccess: noop, onFinish: noop };
  const runner = new TestRunner(emptyRunnerCallbacks);
  const asserter = new Asserter(runner);
  const failGenerator = new FailureGenerator(runner);
  const pendingMarker = new PendingMarker(runner);
  return testBlock(runner, asserter, failGenerator, pendingMarker);
};

const resultOfATestWith = async assertBlock =>
  withRunner(async(runner, assert, fail, pending) => {
    const testToRun = aTestWithBody(() => assertBlock(assert, fail, pending));
    await runSingleTest(runner, testToRun);
    return testToRun.result();
  });

const resultOfASuiteWith = async(runner, test, before, after) => {
  const emptySuiteCallbacks = { onStart: noop, onFinish: noop };
  const suite = new TestSuite(`suite for ${test.name()}`, noop, emptySuiteCallbacks);
  suite.addTest(test);
  suite.before(before);
  suite.after(after);
  runner.addSuite(suite);
  await runner.run();
  return test.result();
};

module.exports = {
  withRunner,
  runSingleTest,
  resultOfATestWith,
  resultOfASuiteWith,
};
