const { Test } = require('./lib/test');
const { TestSuite } = require('./lib/test_suite');
const Assertions = require('./lib/assertions');

let Testy = {
  currentSuite: function () {
    return this._currentSuite
  },
  setCurrentSuite: function (suite) {
    this._currentSuite = suite
  }
};

global.testy = Testy;
let testy = () => global.testy;

function test(name, testBody) {
  let test = new Test(name, testBody);
  testy().currentSuite().addTest(test);
  
  test.run({
    whenPending: () => console.log(`[WIP] ${test.name()}`),
    whenSuccess: () => console.log(`[OK] ${test.name()}`),
    whenFailed: () => {
      console.log(`[FAIL] ${test.name()}`);
      console.log(`  => ${test.result().failureMessage}`)
    }
  });
}

function suite(name, suiteBody) {
  let suite = new TestSuite(name, suiteBody);
  testy().setCurrentSuite(suite);
  suite.run();
  
  console.log(`${suite.name()} summary:`);
  let total = suite.totalCount();
  let success = suite.successCount();
  let pending = suite.pendingCount();
  let failures = suite.failuresCount();
  console.log(`${total} tests, ${success} passed, ${failures} failed, ${pending} pending`)
}

module.exports = Object.assign({ suite: suite, test: test }, Assertions);