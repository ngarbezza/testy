'use strict';

const I18n = require('./i18n');

// Colors and emphasis
const off = '\x1b[0m';
const bold = '\x1b[1m';
const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';

class ConsoleUI {
  constructor() { this.useLanguage(I18n.defaultLanguage()); }
  
  testCallbacks() {
    return {
      whenPending: test => this.renderResult(this.translated('wip'), test, yellow),
      whenSuccess: test => this.renderResult(this.translated('ok'), test, green),
      whenFailed: test => {
        this.renderResult(this.translated('fail'), test, red);
        this.renderFailure(test);
      },
      whenErrored: test => {
        this.renderResult(this.translated('error'), test, red);
        this.renderFailure(test);
      }
    };
  }
  
  suiteCallbacks() {
    return {
      onFinish: suite => {
        this.renderSeparator();
        console.log(`${this.translated('summary_of')} ${suite.name()}:`);
        this.displayCountFor(suite);
        this.renderSeparator();
      }
    };
  }
  
  testRunnerCallbacks() {
    return {
      onFinish: runner => {
        this.renderSeparator();
        console.log(this.translated('total'));
        this.displayCountFor(runner);
        this.renderSeparator();
      }
    };
  }
  
  measuringTotalTime(code) {
    const name = this.translated('total_time');
    console.time(name);
    code();
    console.timeEnd(name);
  }
  
  useLanguage(language) { this._i18n = new I18n(language); }
  translated(key) { return this._i18n.translate(key); }
  
  displayIfNonZero(quantity, word) { return quantity > 0 ? `, ${quantity} ${word}` : ''; }
  renderResult(result, test, color) { console.log(`[${color}${bold}${result}${off}] ${color}${test.name()}${off}`); }
  renderFailure(test) { console.log(`  => ${test.result().failureMessage()}`); }
  renderSeparator() { console.log('='.repeat(80)); }
  
  displayCountFor(suite) {
    console.log(`${suite.totalCount()} test(s)` +
      this.displayIfNonZero(suite.successCount(), this.translated('passed')) +
      this.displayIfNonZero(suite.failuresCount(), this.translated('failed')) +
      this.displayIfNonZero(suite.errorsCount(), this.translated('errors')) +
      this.displayIfNonZero(suite.pendingCount(), this.translated('pending'))
    );
  }
}

module.exports = ConsoleUI;
