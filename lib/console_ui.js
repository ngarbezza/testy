module.exports = {
  testCallbacks: {
    whenPending: (test) => console.log(`[WIP] ${test.name()}`),
    whenSuccess: (test) => console.log(`[OK] ${test.name()}`),
    whenFailed: (test) => {
      console.log(`[FAIL] ${test.name()}`);
      console.log(`  => ${test.result().failureMessage}`);
    }
  },
  suiteCallbacks: {
    onFinish: (suite) => {
      console.log(`${suite.name()} summary:`);
      let total = suite.totalCount();
      let success = suite.successCount();
      let pending = suite.pendingCount();
      let failures = suite.failuresCount();
      console.log(`${total} tests, ${success} passed, ${failures} failed, ${pending} pending`);
    }
  },
  measure: (name, code) => {
    console.time(name);
    code();
    console.timeEnd(name);
  }
};