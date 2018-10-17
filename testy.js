const { TestRunner } = require('./lib/test_runner');
const ConsoleUI = require('./lib/console_ui');

let testRunner = new TestRunner();

function test(name, testBody) {
  testRunner.registerTest(name, testBody, ConsoleUI.testCallbacks)
}

function suite(name, suiteBody) {
  testRunner.registerSuite(name, suiteBody, ConsoleUI.suiteCallbacks)
}

function before(initialization) {
  testRunner.registerBefore(initialization);
}

module.exports = Object.assign(
  { suite: suite, test: test, before: before },
  testRunner.availableAssertions()
);