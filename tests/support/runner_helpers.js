'use strict';

import { TestRunner } from '../../lib/core/test_runner.js';
import { TestSuite } from '../../lib/core/test_suite.js';
import { Asserter, FailureGenerator, PendingMarker } from '../../lib/core/asserter.js';
import { aTestWithBody } from './tests_factory.js';
import { FailFast } from '../../lib/config/fail_fast.js';

const noop = async() => {
  // intentionally empty function
};

const emptyRunnerCallbacks = { onFailure: noop, onSuccess: noop, onFinish: noop };

const withRunner = async testBlock => withRunnerAndCallbacks(emptyRunnerCallbacks, testBlock);

const withRunnerAndCallbacks = async(callbacks, testBlock) => {
  const runner = new TestRunner(callbacks);
  const asserter = new Asserter(runner);
  const failGenerator = new FailureGenerator(runner);
  const pendingMarker = new PendingMarker(runner);
  return testBlock(runner, asserter, failGenerator, pendingMarker);
};

const resultOfATestWith = async assertBlock =>
  withRunner(async(runner, assert, fail, pending) => {
    const testToRun = aTestWithBody(() => assertBlock(assert, fail, pending));
    return await resultOfASuiteWith(runner, testToRun);
  });

const resultOfASuiteWith = async(runner, test, before = noop, after = noop) => {
  const emptySuiteCallbacks = { onStart: noop, onFinish: noop };
  const suite = new TestSuite(`suite for ${test.name()}`, noop, emptySuiteCallbacks);
  suite.addTest(test);
  suite.before(before);
  suite.after(after);
  runner.addSuite(suite);
  runner.setFailFastMode(FailFast.disabled());
  runner.setTestRandomness(false);
  runner.setTestExecutionTimeoutMs(50);
  await runner.run();
  return test.result();
};

export {
  withRunner,
  withRunnerAndCallbacks,
  resultOfATestWith,
  resultOfASuiteWith,
  emptyRunnerCallbacks,
};
