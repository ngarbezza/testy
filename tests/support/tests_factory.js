'use strict';

import { Test } from '../../lib/core/test.js';

const noop = () => {
  // intentional empty function
};

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
    throw new Error('oops');
  }, emptyTestCallbacks);

const aPendingTest = () =>
  new Test('a work in progress', undefined, emptyTestCallbacks);

const aTestWithNoAssertions = () =>
  aTestWithBody(() => 1 + 2);

const aTestRunningFor = (millis, asserter) =>
  new Test('sleepFor', async() => {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(millis);
    asserter.isTrue(true);
  }, emptyTestCallbacks);

const aTestWithBody = body =>
  new Test('just a test', body, emptyTestCallbacks);

export {
  aTestWithBody,
  aPassingTest,
  aFailingTest,
  anErroredTest,
  aPendingTest,
  aTestWithNoAssertions,
  aTestRunningFor,
  emptyTestCallbacks,
};
