'use strict';

const { Asserter } = require('../../lib/asserter');
const TestRunner = require('../../lib/test_runner');
const TestSuite = require('../../lib/test_suite');

const runSingleTest = (runner, test) => {
  const noop = () => {};
  const emptySuiteCallbacks = { onStart: noop, onFinish: noop };
  const suite = new TestSuite(`suite for ${test.name()}`, noop, emptySuiteCallbacks);
  suite.addTest(test);
  runner.addSuite(suite);
  runner.run();
  return test.result();
};

const withRunner = testBlock => {
  const noop = () => {};
  const emptyRunnerCallbacks = { onFinish: noop };
  const runner = new TestRunner(emptyRunnerCallbacks);
  const asserter = new Asserter(runner);
  testBlock(runner, asserter);
};

module.exports = {
  withRunner,
  runSingleTest,
};
