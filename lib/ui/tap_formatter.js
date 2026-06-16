import { Formatter } from './formatter.js';
import { normalizeToSingleLine } from '../utils/index.js';

/**
 * I present test results in TAP (Test Anything Protocol) version 13: a compact, line-oriented,
 * machine-readable format. I stream one line per test and finish with a trailing plan and summary.
 */
export class TapFormatter extends Formatter {
  #testNumber;
  #startTime;

  constructor(console, i18n) {
    super(console, i18n);
    this.#testNumber = 0;
    this.#startTime = 0;
  }

  startTimer() {
    this.#startTime = Date.now();
  }

  displayInitialInformation(_configuration, _paths) {
    this.print('TAP version 13');
  }

  displaySuccessResult(test) {
    this.print(`ok ${this.#nextNumber()} - ${test.name()}`);
  }

  displaySkippedResult(test) {
    this.print(`ok ${this.#nextNumber()} - ${test.name()} # SKIP`);
  }

  displayPendingResult(test) {
    this.print(`ok ${this.#nextNumber()} - ${test.name()} # TODO`);
  }

  displayFailureResult(test, failType) {
    const severity = failType === 'error' ? 'error' : 'failure';
    this.print(`not ok ${this.#nextNumber()} - ${test.name()}`);
    this.#printDiagnostic(test, severity);
  }

  displayRunnerEnd(runner) {
    this.print(`1..${runner.totalCount()}`);
    this.print(`# tests ${runner.totalCount()}`);
    this.print(`# pass ${runner.successCount()}`);
    this.print(`# fail ${runner.failuresCount()}`);
    this.print(`# error ${runner.errorsCount()}`);
    this.print(`# pending ${runner.pendingCount()}`);
    this.print(`# skip ${runner.skippedCount()}`);
    this.print(`# time ${Date.now() - this.#startTime}ms`);
  }

  #printDiagnostic(test, severity) {
    const message = normalizeToSingleLine(this.internationalized(test.result().failureMessage()));
    const location = this.internationalized(test.result().location());
    this.print('  ---');
    this.print(`  message: ${message}`);
    this.print(`  at: ${location}`);
    this.print(`  severity: ${severity}`);
    this.print('  ---');
  }

  #nextNumber() {
    this.#testNumber += 1;
    return this.#testNumber;
  }
}
