'use strict';

const Test = require('../../lib/test');

const noop = () => {};
const emptyTestCallbacks = {
  whenErrored: noop,
  whenFailed: noop,
  whenPending: noop,
  whenSkipped: noop,
  whenSuccess: noop,
};

const aPassingTest = asserter =>
  new Test('a pure success', () => asserter.isTrue(true), emptyTestCallbacks);

const aFailingTest = asserter =>
  new Test('a true failure', () => asserter.isFalse(true), emptyTestCallbacks);

const anErroredTest = () =>
  new Test('an unexpected error', () => {
    throw 'oops'; 
  }, emptyTestCallbacks);

const aPendingTest = () =>
  new Test('a work in progress', undefined, emptyTestCallbacks);

const aTestWithNoAssertions = () =>
  aTestWithBody(() => 1 + 2);

const aTestWithBody = body =>
  new Test('just a test', body, emptyTestCallbacks);

module.exports = {
  aTestWithBody,
  aPassingTest,
  aFailingTest,
  anErroredTest,
  aPendingTest,
  aTestWithNoAssertions,
};
