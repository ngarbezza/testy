function displayIfNonZero(quantity, word) {
  return quantity > 0 ? `, ${quantity} ${word}` : '';
}

function renderResult(result, test) {
  console.log(`[${result}] ${test.name()}`);
}

function renderFailure(test) {
  console.log(`  => ${test.result().failureMessage}`);
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
      console.log(`${suite.name()} summary:`);
      console.log(`${suite.totalCount()} tests` +
        displayIfNonZero(suite.successCount(), 'passed') +
        displayIfNonZero(suite.failuresCount(), 'failed') +
        displayIfNonZero(suite.errorsCount(), 'error(s)') +
        displayIfNonZero(suite.pendingCount(), 'pending')
      );
    }
  },
  measure: (name, code) => {
    console.time(name);
    code();
    console.timeEnd(name);
  }
};