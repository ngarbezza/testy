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
  #suites;
  #callbacks;
  #currentSuite;
  #failFastMode;
  #randomOrder;
  #testExecutionTimeoutMs;

  constructor(callbacks) {
    this.#suites = [];
    this.#callbacks = callbacks;
    this.setFailFastMode(FailFast.default());
  }

  // Configuration

  registerSuite(name, suiteBody, callbacks) {
    const suiteToAdd = new TestSuite(name, suiteBody, callbacks);
    return this.addSuite(suiteToAdd);
  }

  registerTest(name, testBody, callbacks) {
    const testToAdd = new Test(name, testBody, callbacks);
    this.#currentSuite.addTest(testToAdd);
    return testToAdd;
  }

  registerBefore(beforeBlock) {
    this.#currentSuite.before(beforeBlock);
  }

  registerAfter(afterBlock) {
    this.#currentSuite.after(afterBlock);
  }

  addSuite(suiteToAdd) {
    this.#suites.push(suiteToAdd);
    this.#setCurrentSuite(suiteToAdd);
    return suiteToAdd;
  }

  setFailFastMode(failFastMode) {
    this.#failFastMode = failFastMode;
  }

  setTestRandomness(randomnessEnabled) {
    this.#randomOrder = randomnessEnabled;
  }

  setTestExecutionTimeoutMs(timeoutMs) {
    this.#testExecutionTimeoutMs = timeoutMs;
  }

  // Executing

  async run() {
    this.#randomizeSuites();
    // eslint-disable-next-line no-restricted-syntax
    for (const suite of this.#suites) {
      this.#setCurrentSuite(suite);
      // eslint-disable-next-line no-await-in-loop
      await suite.run(this.#executionContext());
    }
    this.#finish();
  }

  setResultForCurrentTest(result) {
    this.#currentSuite.currentTest().setResult(result);
  }

  // Counting

  successCount() {
    return this.#countEach('successCount');
  }

  pendingCount() {
    return this.#countEach('pendingCount');
  }

  errorsCount() {
    return this.#countEach('errorsCount');
  }

  failuresCount() {
    return this.#countEach('failuresCount');
  }

  skippedCount() {
    return this.#countEach('skippedCount');
  }

  totalCount() {
    return this.#countEach('totalCount');
  }

  allFailuresAndErrors() {
    return this.#suites.reduce((failures, suite) =>
      failures.concat(suite.allFailuresAndErrors()), [],
    );
  }

  hasErrorsOrFailures() {
    return this.allFailuresAndErrors().length > 0;
  }

  // Private

  #setCurrentSuite(suite) {
    this.#currentSuite = suite;
  }

  #countEach(property) {
    return this.#suites.reduce((count, suite) =>
      count + suite[property](), 0,
    );
  }

  #randomizeSuites() {
    if (this.#randomOrder) {
      shuffle(this.#suites);
    }
  }

  #executionContext() {
    return {
      failFastMode: this.#failFastMode,
      randomOrderMode: this.#randomOrder,
      testExecutionTimeoutMs: this.#testExecutionTimeoutMs,
    };
  }

  #finish() {
    this.#callbacks.onFinish(this);
    if (this.hasErrorsOrFailures()) {
      return this.#callbacks.onFailure(this);
    } else {
      return this.#callbacks.onSuccess(this);
    }
  }
}
