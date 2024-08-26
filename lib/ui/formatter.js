import { isEmpty, isString } from '../utils.js';

// Colors and emphasis
const off = '\x1b[0m';
const bold = '\x1b[1m';
const cyan = '\x1b[36m';
const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';

const consoleWidth = 80;

export class Formatter {
  #console;
  #i18n;
  #timerName;
  #filter;

  constructor(console, i18n) {
    this.#console = console;
    this.#i18n = i18n;
    this.#timerName = this.#translated('total_time');
  }

  startTimer() {
    this.#console.time(this.#timerName);
  }

  endTimer() {
    this.#console.timeEnd(this.#timerName);
  }

  displayInitialInformation(configuration, paths) {
    this.#filter = configuration.filterRaw();
    this.#displaySeparator();
    this.#displayConfigurationSummary(paths, configuration);
    this.#displaySeparator();
  }

  displayRunnerEnd(runner) {
    this.#displayErrorsAndFailuresSummary(runner);
    this.#displayGeneralSummary(runner);
  }

  // displaying suites

  displaySuiteStart(suite) {
    this.#console.log(`\n${suite.name()}:`);
    this.#displaySeparator('-');
  }

  displaySuiteEnd(suite) {
    this.#displaySeparator('-');
    this.#console.log(`${this.#translated('summary_of')} ${suite.name()}:`);
    this.#displayCountFor(suite);
    this.#displaySeparator();
  }

  // displaying test results

  displayPendingResult(test) {
    this.#displayResult(this.#translated('wip'), test, yellow);
    if (test.isExplicitlyMarkedPending()) {
      this.#displayResultDetail(test.result().reason());
    }
  }

  displaySkippedResult(test) {
    this.#displayResult(this.#translated('skip'), test, cyan);
  }

  displaySuccessResult(test) {
    this.#displayResult(this.#translated('ok'), test, green);
  }

  displayFailureResult(test, failType) {
    this.#displayResult(this.#translated(failType), test, red);
    this.#displayResultDetail(test.result().failureMessage());
    this.#displayResultDetail(test.result().location());
  }

  // displaying other messages

  displayError(message) {
    this.#console.log(`${this.#withColor(this.#potentiallyInternationalized(message), red)}`);
  }

  #displayConfigurationSummary(paths, configuration) {
    const testPathsLabel = this.#translated('running_tests_in');
    const failFastLabel = this.#translated('fail_fast');
    const randomOrderLabel = this.#translated('random_order');
    this.#console.log(this.#inBold(this.#translated('starting_testy')));
    const padding = Math.max(testPathsLabel.length, failFastLabel.length, randomOrderLabel.length);
    this.#console.log(`${testPathsLabel.padEnd(padding)} : ${paths}`);
    this.#console.log(`${failFastLabel.padEnd(padding)} : ${this.#humanBoolean(configuration.failFastMode().enabled())}`);
    this.#console.log(`${randomOrderLabel.padEnd(padding)} : ${this.#humanBoolean(configuration.randomOrder())}`);
  }

  // private - displaying

  #displayResult(result, test, color) {
    this.#console.log(`[${color}${this.#inBold(result)}] ${this.#withColor(test.name(), color)}`);
  }

  #displayResultDetail(detail) {
    if (!isEmpty(detail)) {
      this.#console.log(`  => ${this.#potentiallyInternationalized(detail)}`);
    }
  }

  #displayErrorsAndFailuresSummary(runner) {
    if (runner.hasErrorsOrFailures()) {
      this.#console.log(`\n${this.#translated('failures_summary')}`);
      runner.allFailuresAndErrors().forEach(test => {
        const failType = test.isFailure() ? 'fail' : 'error';
        this.displayFailureResult(test, failType);
      });
      this.#displaySeparator();
    }
  }

  #displayGeneralSummary(runner) {
    this.#console.log(`\n${this.#translated('total')}`);
    this.#displayCountFor(runner);
    this.#displaySeparator();
  }

  #displayCountFor(runner) {
    const passedCount = this.#displayIfNonZero(runner.successCount(), this.#translated('passed'), green);
    const failureCount = this.#displayIfNonZero(runner.failuresCount(), this.#translated('failed'), red);
    const errorCount = this.#displayIfNonZero(runner.errorsCount(), this.#translated('errors'), red);
    const pendingCount = this.#displayIfNonZero(runner.pendingCount(), this.#translated('pending'), yellow);
    const skippedCount = this.#displayIfNonZero(runner.skippedCount(), this.#translated('skipped'), yellow);
    this.#console.log(`${runner.totalCount()} test(s)${passedCount}${failureCount}${errorCount}${pendingCount}${skippedCount}`);
    if (runner.totalCount() === 0) {
      this.#console.log(this.#withColor(`\nWarning: Make sure your files matches the ${this.#filter} naming filter.`, yellow));
    }
  }

  #displayIfNonZero(quantity, word, color = off) {
    const pluralizedWord = `${quantity} ${word}`;
    return quantity > 0 ? `, ${this.#withColor(pluralizedWord, color)}` : '';
  }

  #displaySeparator(character = '=') {
    this.#console.log(character.repeat(consoleWidth));
  }

  // private - formatting and localization

  #inBold(text) {
    return `${bold}${text}${off}`;
  }

  #withColor(text, color) {
    return `${color}${text}${off}`;
  }

  #humanBoolean(boolean) {
    return boolean === true ? this.#translated('yes') : this.#translated('no');
  }

  #translated(key) {
    return this.#i18n.translate(key);
  }

  #potentiallyInternationalized(text) {
    return isString(text) ? text : text.expressedIn(this.#i18n);
  }
}
