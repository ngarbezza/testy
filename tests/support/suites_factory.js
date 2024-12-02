import { TestSuite } from '../../lib/core/test_suite.js';

const noop = () => {
  // intentionally empty function
};

const emptySuiteCallbacks = {
  onStart: noop,
  onFinish: noop,
};

const fakePathLocation = 'I/am/a/fake/path/location';

const newEmptySuite = () =>
  suiteNamed('myTestSuite');

const emptySuiteBody = noop;

const suiteNamed = suiteName =>
  new TestSuite(suiteName, noop, emptySuiteCallbacks, fakePathLocation);

export {
  newEmptySuite,
  suiteNamed,
  emptySuiteBody,
  emptySuiteCallbacks,
  fakePathLocation,
};
