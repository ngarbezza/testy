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

const aPassingTest = (asserter, callbacks = {}) =>
  new Test('a pure success', () => asserter.isTrue(true), { ...emptyTestCallbacks, ...callbacks });

const aFailingTest = (asserter, callbacks = {}) =>
  new Test('a true failure', () => asserter.isFalse(true), { ...emptyTestCallbacks, ...callbacks });

const anErroredTest = () =>
  new Test('an unexpected error', () => {
    throw new Error('oops');
  }, emptyTestCallbacks);

const aPendingTest = () =>
  new Test('a work in progress', undefined, emptyTestCallbacks);

const anExplicitlySkippedTest = asserter => {
  const aTest = new Test('a test that is skipped', () => {
    asserter.isTrue(false);
  }, emptyTestCallbacks);
  aTest.skip();
  return aTest;
};

const aTestWithNoAssertions = () =>
  aTestWithBody(() => 1 + 2);

const aTestRunningFor = (millis, asserter) =>
  new Test('sleepFor', async() => {

    const sleep = ms => new Promise(resolve => {
      setTimeout(resolve, ms);
    });
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
  anExplicitlySkippedTest,
  aPendingTest,
  aTestWithNoAssertions,
  aTestRunningFor,
  emptyTestCallbacks,
};
