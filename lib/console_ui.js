'use strict';

const I18n = require('./i18n');

// Colors and emphasis
const off = '\x1b[0m';
const bold = '\x1b[1m';
const grey = '\x1b[30m';
const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';

const consoleWidth = 80;

const successfulExitCode = 0;
const failedExitCode = 1;

class ConsoleUI {
  constructor() {
    this.useLanguage(I18n.defaultLanguage());
    this.filter = '';
  }
  
  // Callbacks for runner/suite/test
  
  testCallbacks() {
    return {
      whenPending: test => {
        this._displayResult(this.translated('wip'), test, yellow);
        if (test.isExplicitlyMarkedPending()) {
          this._displayResultDetail(test.result().reason());
        }
      },
      whenSkipped: test => {
        this._displayResult(this.translated('skip'), test, grey);
      },
      whenSuccess: test => {
        this._displayResult(this.translated('ok'), test, green);
      },
      whenFailed: test => {
        this._displayResult(this.translated('fail'), test, red);
        this._displayResultDetail(test.result().failureMessage());
      },
      whenErrored: test => {
        this._displayResult(this.translated('error'), test, red);
        this._displayResultDetail(test.result().failureMessage());
      }
    };
  }
  
  suiteCallbacks() {
    return {
      onStart: suite => {
        console.log(`\n${suite.name()}:`);
        this._displaySeparator('-');
      },
      onFinish: suite => {
        this._displaySeparator('-');
        console.log(`${this.translated('summary_of')} ${suite.name()}:`);
        this._displayCountFor(suite);
        this._displaySeparator();
      }
    };
  }
  
  testRunnerCallbacks() {
    return {
      onFinish: runner => {
        this._displayErrorsAndFailuresSummary(runner);
        this._displaySummary(runner);
      },
      onSuccess: () => {
        this._exitWithCode(successfulExitCode);
      },
      onFailure: () => {
        this._exitWithCode(failedExitCode);
      }
    };
  }
  
  displayInitialSummary(configuration, paths) {
    this._displaySeparator();
    
    console.log(this._inBold(this.translated('starting_testy')));
    this._displayRunConfiguration(paths, configuration);
    this._displaySeparator();
  }
  
  measuringTotalTime(code) {
    const name = this.translated('total_time');
    console.time(name);
    code.call();
    console.timeEnd(name);
  }
  
  useLanguage(language) {
    this._i18n = new I18n(language);
  }
  
  translated(key) {
    return this._i18n.translate(key);
  }
  
  exitWithError(errorMessage) {
    this._displayError(errorMessage, red);
    this._exitWithCode(failedExitCode);
  }
  
  _exitWithCode(exitCode) {
    process.exit(exitCode);
  }
  
  _displayRunConfiguration(paths, configuration) {
    const testPaths = this.translated('running_tests_in');
    const failFast = this.translated('fail_fast');
    const randomOrder = this.translated('random_order');
    const padding = Math.max(testPaths.length, failFast.length, randomOrder.length);
    this.filter = configuration.filterRaw();
    console.log(`${testPaths.padEnd(padding)} : ${paths}`);
    console.log(`${failFast.padEnd(padding)} : ${this._humanBoolean(configuration.failFastMode().enabled())}`);
    console.log(`${randomOrder.padEnd(padding)} : ${this._humanBoolean(configuration.randomOrder())}`);
  }
  
  _displayIfNonZero(quantity, word, color = off) {
    return quantity > 0 ? `, ${this._withColor(`${quantity} ${word}`, color)}` : '';
  }
  
  _displayResult(result, test, color) {
    console.log(`[${color}${this._inBold(result)}] ${this._withColor(test.name(), color)}`);
  }
  
  _displayResultDetail(detail) {
    console.log(`  => ${detail}`);
  }
  
  _displaySeparator(character = '=') {
    console.log(character.repeat(consoleWidth));
  }

  _displayError(text, color) {
    console.log(`${this._withColor(text, color)}`);
  }
  
  _displayCountFor(runner) {
    const passedCount = this._displayIfNonZero(runner.successCount(), this.translated('passed'), green);
    const failureCount = this._displayIfNonZero(runner.failuresCount(), this.translated('failed'), red);
    const errorCount = this._displayIfNonZero(runner.errorsCount(), this.translated('errors'), red);
    const pendingCount = this._displayIfNonZero(runner.pendingCount(), this.translated('pending'));
    const skippedCount = this._displayIfNonZero(runner.skippedCount(), this.translated('skipped'), yellow);
    console.log(`${runner.totalCount()} test(s)${passedCount}${failureCount}${errorCount}${pendingCount}${skippedCount}`);
    if (runner.totalCount() === 0) {
      console.log(this._withColor(`\nWarning: Make sure your files matches the ${this.filter} naming filter.`, yellow));
    }
  }
  
  _displayErrorsAndFailuresSummary(runner) {
    if (runner.hasErrorsOrFailures()) {
      console.log(`\n${this.translated('failures_summary')}`);
      runner.allFailuresAndErrors().forEach(test => {
        if (test.isFailure()) {
          this._displayResult(this.translated('fail'), test, red);
        } else {
          this._displayResult(this.translated('error'), test, red);
        }
        this._displayResultDetail(test.result().failureMessage());
      });
      this._displaySeparator();
    }
  }
  
  _displaySummary(runner) {
    console.log(`\n${this.translated('total')}`);
    this._displayCountFor(runner);
    this._displaySeparator();
  }
  
  _inBold(text) {
    return `${bold}${text}${off}`;
  }
  
  _withColor(text, color) {
    return `${color}${text}${off}`;
  }
  
  _humanBoolean(boolean) {
    return boolean === true ? this.translated('yes') : this.translated('no');
  }
}

module.exports = ConsoleUI;
