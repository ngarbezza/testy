function displayIfNonZero(quantity, word) {
  return quantity > 0 ? `, ${quantity} ${word}` : '';
}

function renderResult(result, test) {
  console.log(`[${result}] ${test.name()}`);
}

function renderFailure(test) {
  console.log(`  => ${test.result().failureMessage}`);
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
    whenPending: (test) => renderResult('WIP', test),
    whenSuccess: (test) => renderResult('OK', test),
    whenFailed: (test) => {
      renderResult('FAIL', test);
      renderFailure(test);
    },
    whenErrored: (test) => {
      renderResult('ERROR', test);
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
