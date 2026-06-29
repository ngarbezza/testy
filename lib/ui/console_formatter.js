import { isEmpty } from '../utils/index.js';
import { Formatter } from './formatter.js';

const
  off = '\x1b[0m',
  bold = '\x1b[1m',
  cyan = '\x1b[36m',
  red = '\x1b[31m',
  green = '\x1b[32m',
  yellow = '\x1b[33m';

const consoleWidth = 80;

/**
 * I present all the events from Testy as formatted text to a [console]{@link ConsoleUI}.
 */
export class ConsoleFormatter extends Formatter {
  #timerName;
  #filter;

  constructor(console, i18n) {
    super(console, i18n);
    this.#timerName = this.translated('total_time');
  }

  startTimer() {
    this.startConsoleTimer(this.#timerName);
  }

  endTimer() {
    this.endConsoleTimer(this.#timerName);
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
    this.print(`\n${suite.name()}:`);
    this.#displaySeparator('-');
  }

  displaySuiteEnd(suite) {
    this.#displaySeparator('-');
    this.print(`${this.translated('summary_of')} ${suite.name()}:`);
    this.#displayCountFor(suite);
    this.#displaySuiteFilePath(suite);
    this.#displaySeparator();
  }

  // displaying test results

  displayPendingResult(test) {
    this.#displayResult(this.translated('wip'), test, yellow);
    if (test.isExplicitlyMarkedPending()) {
      this.#displayResultDetail(test.result().reason());
    }
  }

  displaySkippedResult(test) {
    this.#displayResult(this.translated('skip'), test, cyan);
  }

  displaySuccessResult(test) {
    this.#displayResult(this.translated('ok'), test, green);
  }

  displayFailureResult(test, failType) {
    this.#displayResult(this.translated(failType), test, red);
    this.#displayResultDetail(test.result().failureMessage());
    this.#displayResultDetail(test.result().location());
  }

  // displaying other messages

  displayError(message) {
    this.print(`${ConsoleFormatter.#withColor(this.internationalized(message), red)}`);
  }

  #displayConfigurationSummary(paths, configuration) {
    const testPathsLabel = this.translated('running_tests_in');
    const failFastLabel = this.translated('fail_fast');
    const randomOrderLabel = this.translated('random_order');
    this.print(ConsoleFormatter.#inBold(this.translated('starting_testy')));
    const padding = Math.max(testPathsLabel.length, failFastLabel.length, randomOrderLabel.length);
    this.print(`${testPathsLabel.padEnd(padding)} : ${paths}`);
    this.print(`${failFastLabel.padEnd(padding)} : ${this.#humanBoolean(configuration.failFastMode().enabled())}`);
    this.print(`${randomOrderLabel.padEnd(padding)} : ${this.#humanBoolean(configuration.randomOrder())}`);
  }

  // private - displaying

  #displayResult(result, test, color) {
    this.print(`[${color}${ConsoleFormatter.#inBold(result)}] ${ConsoleFormatter.#withColor(test.name(), color)}`);
  }

  #displayResultDetail(detail) {
    if (!isEmpty(detail)) {
      this.print(`  => ${this.internationalized(detail)}`);
    }
  }

  #displayErrorsAndFailuresSummary(runner) {
    if (runner.hasErrorsOrFailures()) {
      this.print(`\n${this.translated('failures_summary')}`);
      runner.allFailuresAndErrors().forEach(test => {
        const failType = test.isFailure() ? 'fail' : 'error';
        this.displayFailureResult(test, failType);
      });
      this.#displaySeparator();
    }
  }

  #displayGeneralSummary(runner) {
    this.print(`\n${this.translated('total')}`);
    this.#displayCountFor(runner);
    this.#displaySeparator();
  }

  #displaySuiteFilePath(suite) {
    this.print(`\n${this.translated('file')}: ${suite.locationPath()}`);
  }

  #displayCountFor(runner) {
    const passedCount = ConsoleFormatter.#displayIfNonZero(runner.successCount(), this.translated('passed'), green);
    const failureCount = ConsoleFormatter.#displayIfNonZero(runner.failuresCount(), this.translated('failed'), red);
    const errorCount = ConsoleFormatter.#displayIfNonZero(runner.errorsCount(), this.translated('errors'), red);
    const pendingCount = ConsoleFormatter.#displayIfNonZero(runner.pendingCount(), this.translated('pending'), yellow);
    const skippedCount = ConsoleFormatter.#displayIfNonZero(runner.skippedCount(), this.translated('skipped'), yellow);
    this.print(`${runner.totalCount()} test(s)${passedCount}${failureCount}${errorCount}${pendingCount}${skippedCount}`);
    if (runner.totalCount() === 0) {
      this.print(ConsoleFormatter.#withColor(`\nWarning: Make sure your files matches the ${this.#filter} naming filter.`, yellow));
    }
  }

  static #displayIfNonZero(quantity, word, color = off) {
    const pluralizedWord = `${quantity} ${word}`;
    return quantity > 0 ? `, ${ConsoleFormatter.#withColor(pluralizedWord, color)}` : '';
  }

  #displaySeparator(character = '=') {
    this.print(character.repeat(consoleWidth));
  }

  // private - formatting and localization

  static #inBold(text) {
    return `${bold}${text}${off}`;
  }

  static #withColor(text, color) {
    return `${color}${text}${off}`;
  }

  #humanBoolean(boolean) {
    return boolean === true ? this.translated('yes') : this.translated('no');
  }
}
