'use strict';

const TestSuite = require('../../lib/test_suite');

const noop = () => {};
const emptySuiteCallbacks = {
  onStart: noop,
  onFinish: noop,
};

const newEmptySuite = () =>
  suiteNamed('myTestSuite');

const suiteNamed = suiteName =>
  new TestSuite(suiteName, () => {}, emptySuiteCallbacks);

module.exports = {
  newEmptySuite,
  suiteNamed,
};
