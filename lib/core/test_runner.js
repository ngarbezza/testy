'use strict';

import { Test } from './test.js';
import { TestSuite } from './test_suite.js';
import { FailFast } from '../config/fail_fast.js';
import { shuffle } from '../utils.js';

/**
 * I am responsible for executing [test suites]{@link TestSuite} using a given [configuration]{@link Configuration},
 * collecting the results of each test of each suite and reporting the aggregated [results]({@link TestResult})
 * using a callback-based mechanism.
 */
export class TestRunner {
  constructor(callbacks) {
    this._suites = [];
    this._callbacks = callbacks;
    this.setFailFastMode(FailFast.default());
  }

  // Configuration

  registerSuite(name, suiteBody, callbacks) {
    const suiteToAdd = new TestSuite(name, suiteBody, callbacks);
    return this.addSuite(suiteToAdd);
  }

  registerTest(name, testBody, callbacks) {
    const testToAdd = new Test(name, testBody, callbacks);
    this._currentSuite.addTest(testToAdd);
  }

  registerBefore(beforeBlock) {
    this._currentSuite.before(beforeBlock);
  }

  registerAfter(afterBlock) {
    this._currentSuite.after(afterBlock);
  }

  addSuite(suiteToAdd) {
    this._suites.push(suiteToAdd);
    this._setCurrentSuite(suiteToAdd);
    return suiteToAdd;
  }

  setFailFastMode(failFastMode) {
    this._failFastMode = failFastMode;
  }

  setTestRandomness(randomnessEnabled) {
    this._randomOrder = randomnessEnabled;
  }

  setTestExecutionTimeoutMs(timeoutMs) {
    this._testExecutiontimeoutMs = timeoutMs;
  }

  // Executing

  async run() {
    this._randomizeSuites();
    // eslint-disable-next-line no-restricted-syntax
    for (const suite of this._suites) {
      this._setCurrentSuite(suite);
      await suite.run(this._executionContext());
    }
    this._finish();
  }

  setResultForCurrentTest(result) {
    this._currentSuite.currentTest().setResult(result);
  }

  _executionContext() {
    return {
      failFastMode: this._failFastMode,
      randomOrderMode: this._randomOrder,
      testExecutionTimeoutMs: this._testExecutiontimeoutMs,
    };
  }

  _finish() {
    this._callbacks.onFinish(this);
    if (this.hasErrorsOrFailures()) {
      return this._callbacks.onFailure(this);
    } else {
      return this._callbacks.onSuccess(this);
    }
  }

  // Counting

  successCount() {
    return this._countEach('successCount');
  }

  pendingCount() {
    return this._countEach('pendingCount');
  }

  errorsCount() {
    return this._countEach('errorsCount');
  }

  failuresCount() {
    return this._countEach('failuresCount');
  }

  skippedCount() {
    return this._countEach('skippedCount');
  }

  totalCount() {
    return this._countEach('totalCount');
  }

  allFailuresAndErrors() {
    return this._suites.reduce((failures, suite) =>
      failures.concat(suite.allFailuresAndErrors()), [],
    );
  }

  hasErrorsOrFailures() {
    return this.allFailuresAndErrors().length > 0;
  }

  // Private

  _setCurrentSuite(suite) {
    this._currentSuite = suite;
  }

  _countEach(property) {
    return this._suites.reduce((count, suite) =>
      count + suite[property](), 0,
    );
  }

  _randomizeSuites() {
    if (this._randomOrder) {
      shuffle(this._suites);
    }
  }
}
