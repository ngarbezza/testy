const requireDir = require('require-dir');
const { TestRunner } = require('./lib/test_runner');
const ConsoleUI = require('./lib/console_ui');

let testRunner = new TestRunner();
const UI = ConsoleUI;

function test(name, testBody) {
  testRunner.registerTest(name, testBody, UI.testCallbacks);
}

function suite(name, suiteBody) {
  UI.measure('total time', () =>
    testRunner.registerSuite(name, suiteBody, UI.suiteCallbacks)
  );
}

function before(initialization) {
  testRunner.registerBefore(initialization);
}

function runTesty(options) { requireDir(options.directory); }

module.exports = Object.assign(
  { runTesty: runTesty, suite: suite, test: test, before: before },
  testRunner.availableAssertions()
);