import { createRequire } from 'node:module';
import { Formatter } from './formatter.js';

const require = createRequire(import.meta.url);
const { name: toolName, version: toolVersion } = require('../../package.json');

/**
 * I accumulate test results as the run progresses and emit a single structured JSON document
 * when the run finishes. Status tokens are language-neutral; failure messages are resolved in
 * the configured language.
 */
export class JsonFormatter extends Formatter {
  #suites;
  #currentSuite;
  #startTime;

  constructor(console, i18n, clock) {
    super(console, i18n, clock);
    this.#suites = [];
    this.#currentSuite = undefined;
    this.#startTime = 0;
  }

  startTimer() {
    this.#startTime = this.currentTime();
  }

  displaySuiteStart(suite) {
    this.#currentSuite = { name: suite.name(), file: suite.locationPath(), tests: [] };
    this.#suites.push(this.#currentSuite);
  }

  displaySuccessResult(test) {
    this.#record(test, 'passed');
  }

  displaySkippedResult(test) {
    this.#record(test, 'skipped');
  }

  displayPendingResult(test) {
    this.#record(test, 'pending');
  }

  displayFailureResult(test, failType) {
    const status = failType === 'error' ? 'errored' : 'failed';
    this.#record(test, status, {
      message: this.internationalized(test.result().failureMessage()),
      location: this.internationalized(test.result().location()),
    });
  }

  displayRunnerEnd(runner) {
    const report = {
      tool: toolName,
      version: toolVersion,
      summary: {
        total: runner.totalCount(),
        passed: runner.successCount(),
        failed: runner.failuresCount(),
        errored: runner.errorsCount(),
        pending: runner.pendingCount(),
        skipped: runner.skippedCount(),
        durationMs: this.currentTime() - this.#startTime,
      },
      suites: this.#suites,
    };
    this.print(JSON.stringify(report));
  }

  #record(test, status, failure = undefined) {
    const entry = { name: test.name(), status };
    if (failure !== undefined) {
      entry.failure = failure;
    }
    this.#currentSuite.tests.push(entry);
  }
}
