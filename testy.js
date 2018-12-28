const requireDir = require('require-dir');
const { TestRunner } = require('./lib/test_runner');
const ConsoleUI = require('./lib/console_ui');

const UI = ConsoleUI;
let testRunner = new TestRunner(UI.testRunnerCallbacks);

function test(name, testBody) {
  testRunner.registerTest(name, testBody, UI.testCallbacks);
}

function suite(name, suiteBody) {
  testRunner.registerSuite(name, suiteBody, UI.suiteCallbacks);
}

function before(initialization) {
  testRunner.registerBefore(initialization);
}

function runTesty(options) {
  requireDir(options.directory);
  UI.measure('total time', () => testRunner.run());
}

module.exports = Object.assign(
  { runTesty: runTesty, suite: suite, test: test, before: before },
  testRunner.availableAssertions()
);
