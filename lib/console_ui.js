'use strict';

// Colors and emphasis
const off = '\x1b[0m';
const bold = '\x1b[1m';
const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';

function displayIfNonZero(quantity, word) {
  return quantity > 0 ? `, ${quantity} ${word}` : '';
}

function renderResult(result, test, color) {
  console.log(`[${color}${bold}${result}${off}] ${color}${test.name()}${off}`);
}

function renderFailure(test) {
  console.log(`  => ${test.result().failureMessage()}`);
}

function renderSeparator() { console.log('='.repeat(80)); }

function displayCountFor(suite) {
  console.log(`${suite.totalCount()} tests` +
    displayIfNonZero(suite.successCount(), 'passed') +
    displayIfNonZero(suite.failuresCount(), 'failed') +
    displayIfNonZero(suite.errorsCount(), 'error(s)') +
    displayIfNonZero(suite.pendingCount(), 'pending')
  );
}

module.exports = {
  testCallbacks: {
    whenPending: (test) => renderResult('WIP', test, yellow),
    whenSuccess: (test) => renderResult('OK', test, green),
    whenFailed: (test) => {
      renderResult('FAIL', test, red);
      renderFailure(test);
    },
    whenErrored: (test) => {
      renderResult('ERROR', test, red);
      renderFailure(test);
    }
  },
  suiteCallbacks: {
    onFinish: (suite) => {
      renderSeparator();
      console.log(`${suite.name()} summary:`);
      displayCountFor(suite);
      renderSeparator();
    }
  },
  testRunnerCallbacks: {
    onFinish: (runner) => {
      renderSeparator();
      console.log('Total:');
      displayCountFor(runner);
      renderSeparator();
    }
  },
  measure: (name, code) => {
    console.time(name);
    code();
    console.timeEnd(name);
  }
};
