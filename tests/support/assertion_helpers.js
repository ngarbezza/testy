'use strict';

const { assert } = require('../../testy');
const { Asserter, FailureGenerator, PendingMarker } = require('../../lib/asserter');
const TestResult = require('../../lib/test_result');
const TestRunner = require('../../lib/test_runner');
const TestSuite = require('../../lib/test_suite');
const I18n = require('../../lib/i18n');

const fakeRunner = {
  setResultForCurrentTest(result) {
    this._result = result;
  },
  result() {
    return this._result;
  },
  reset() {
    this.setResultForCurrentTest(undefined);
  },
  _i18n: new I18n(),
};

const asserter = new Asserter(fakeRunner);
const failGenerator = new FailureGenerator(fakeRunner);
const pendingMarker = new PendingMarker(fakeRunner);

const expectSuccess = () => {
  assert.areEqual(fakeRunner.result(), TestResult.success());
  fakeRunner.reset();
};

const expectFailureDueTo = failureMessage => {
  expectFailureOn(fakeRunner, failureMessage);
  fakeRunner.reset();
};

const expectErrorDueTo = failureMessage => {
  expectErrorOn(fakeRunner, failureMessage);
  fakeRunner.reset();
};

const expectPendingResultDueTo = reason => {
  assert.isTrue(fakeRunner.result().isPending());
  assert.areEqual(fakeRunner.result().reason(), reason);
  fakeRunner.reset();
};

const expectFailureOn = (test, failureMessage) => {
  assert.isTrue(test.result().isFailure());
  assert.areEqual(test.result().failureMessage(), failureMessage);
};

const expectErrorOn = (test, errorMessage) => {
  assert.isTrue(test.result().isError());
  assert.areEqual(test.result().failureMessage(), errorMessage);
};

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
  asserter,
  failGenerator,
  pendingMarker,
  expectSuccess,
  expectFailureDueTo,
  expectErrorDueTo,
  expectPendingResultDueTo,
  expectFailureOn,
  expectErrorOn,
};
