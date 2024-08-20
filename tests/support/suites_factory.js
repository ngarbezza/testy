import { TestSuite } from '../../lib/core/test_suite.js';

const noop = () => {
  // intentionally empty function
};

const emptySuiteCallbacks = {
  onStart: noop,
  onFinish: noop,
};

const newEmptySuite = () =>
  suiteNamed('myTestSuite');

const emptySuiteBody = noop;

const suiteNamed = suiteName =>
  new TestSuite(suiteName, noop, emptySuiteCallbacks);

export {
  newEmptySuite,
  suiteNamed,
  emptySuiteBody,
  emptySuiteCallbacks,
};
