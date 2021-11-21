'use strict';

const TestRunner = require('../../lib/test_runner');
const TestSuite = require('../../lib/test_suite');
const { Asserter, FailureGenerator, PendingMarker } = require('../../lib/asserter');
const { aTestWithBody } = require('./tests_factory');

const noop = () => {
  // intentionally empty function
};

const runSingleTest = (runner, test) => {
  const emptySuiteCallbacks = { onStart: noop, onFinish: noop };
  const suite = new TestSuite(`suite for ${test.name()}`, noop, emptySuiteCallbacks);
  suite.addTest(test);
  runner.addSuite(suite);
  runner.run();
  return test.result();
};

const withRunner = testBlock => {
  const emptyRunnerCallbacks = { onFinish: noop };
  const runner = new TestRunner(emptyRunnerCallbacks);
  const asserter = new Asserter(runner);
  const failGenerator = new FailureGenerator(runner);
  const pendingMarker = new PendingMarker(runner);
  return testBlock(runner, asserter, failGenerator, pendingMarker);
};

const resultOfATestWith = assertBlock =>
  withRunner((runner, assert, fail, pending) => {
    const testToRun = aTestWithBody(() => assertBlock(assert, fail, pending));
    runSingleTest(runner, testToRun);
    return testToRun.result();
  });

module.exports = {
  withRunner,
  runSingleTest,
  resultOfATestWith,
};
