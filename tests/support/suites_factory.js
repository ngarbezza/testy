'use strict';

const TestSuite = require('../../lib/test_suite');

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

module.exports = {
  newEmptySuite,
  suiteNamed,
  emptySuiteBody,
  emptySuiteCallbacks,
};
