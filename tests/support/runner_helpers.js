'use strict';

import { TestRunner } from '../../lib/core/test_runner.js';
import { TestSuite } from '../../lib/core/test_suite.js';
import { Asserter, FailureGenerator, PendingMarker } from '../../lib/core/asserter.js';
import { aTestWithBody } from './tests_factory.js';

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

export {
  withRunner,
  runSingleTest,
  resultOfATestWith,
  resultOfASuiteWith,
};
