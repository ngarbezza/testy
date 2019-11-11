'use strict';

const I18n = require('./i18n');

// Colors and emphasis
const off = '\x1b[0m';
const bold = '\x1b[1m';
const grey = '\x1b[30m';
const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';

class ConsoleUI {
  constructor() {
    this.useLanguage(I18n.defaultLanguage());
  }
  
  // Callbacks for runner/suite/test
  
  testCallbacks() {
    return {
      whenPending: test => {
        this._displayResult(this.translated('wip'), test, yellow);
        if (test.isExplicitlyMarkedPending())
          this._displayResultDetail(test.result().reason());
      },
      whenSkipped: test => this._displayResult(this.translated('skip'), test, grey),
      whenSuccess: test => this._displayResult(this.translated('ok'), test, green),
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
      onFinish: suite => {
        this._displaySeparator();
        console.log(`${this.translated('summary_of')} ${suite.name()}:`);
        this._displayCountFor(suite);
        this._displaySeparator();
      }
    };
  }
  
  testRunnerCallbacks() {
    return {
      onFinish: runner => {
        this.displayErrorsAndFailuresSummary(runner);
        this._displaySummary(runner);
      }
    };
  }
  
  measuringTotalTime(code) {
    const name = this.translated('total_time');
    console.time(name);
    code();
    console.timeEnd(name);
  }
  
  useLanguage(language) {
    this._i18n = new I18n(language);
  }
  
  translated(key) {
    return this._i18n.translate(key);
  }
  
  _displayIfNonZero(quantity, word) {
    return quantity > 0 ? `, ${quantity} ${word}` : '';
  }
  
  _displayResult(result, test, color) {
    console.log(`[${color}${bold}${result}${off}] ${color}${test.name()}${off}`);
  }
  
  _displayResultDetail(detail) {
    console.log(`  => ${detail}`);
  }
  
  _displaySeparator() {
    console.log('='.repeat(80));
  }
  
  _displayCountFor(runner) {
    console.log(`${runner.totalCount()} test(s)` +
      this._displayIfNonZero(runner.successCount(), this.translated('passed')) +
      this._displayIfNonZero(runner.failuresCount(), this.translated('failed')) +
      this._displayIfNonZero(runner.errorsCount(), this.translated('errors')) +
      this._displayIfNonZero(runner.pendingCount(), this.translated('pending')) +
      this._displayIfNonZero(runner.skippedCount(), this.translated('skipped'))
    );
  }
  
  displayErrorsAndFailuresSummary(runner) {
    if (runner.hasErrorsOrFailures()) {
      console.log(this.translated('failures_summary'));
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
    console.log(this.translated('total'));
    this._displayCountFor(runner);
    this._displaySeparator();
  }
}

module.exports = ConsoleUI;
