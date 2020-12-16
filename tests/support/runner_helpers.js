'use strict';

const { Asserter } = require('../../lib/asserter');
const TestRunner = require('../../lib/test_runner');
const TestSuite = require('../../lib/test_suite');
const { aTestWithBody } = require('./tests_factory');

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
  return testBlock(runner, asserter);
};

const resultOfATestWith = assertBlock =>
  withRunner((runner, asserter) => {
    const testToRun = aTestWithBody(() => assertBlock(asserter));
    runSingleTest(runner, testToRun);
    return testToRun.result();
  });

module.exports = {
  withRunner,
  runSingleTest,
  resultOfATestWith,
};
