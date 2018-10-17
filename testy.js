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
  let callbacks = {
    whenPending: (test) => console.log(`[WIP] ${test.name()}`),
    whenSuccess: (test) => console.log(`[OK] ${test.name()}`),
    whenFailed: (test) => {
      console.log(`[FAIL] ${test.name()}`);
      console.log(`  => ${test.result().failureMessage}`)
    }
  };
  let test = new Test(name, testBody, callbacks);
  testy().currentSuite().addTest(test);
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

function before(initialization) {
  testy().currentSuite().before(initialization);
}

module.exports = Object.assign({ suite: suite, test: test, before: before }, Assertions);