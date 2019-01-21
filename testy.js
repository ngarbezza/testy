'use strict';

const libDir = './lib';
const requireDir = require('require-dir');
const TestRunner = require(`${libDir}/test_runner`);
const ConsoleUI = require(`${libDir}/console_ui`);

const UI = ConsoleUI;
let testRunner = new TestRunner(UI.testRunnerCallbacks);

function test(name, testBody) {
  testRunner.registerTest(name, testBody, UI.testCallbacks);
}

function suite(name, suiteBody) {
  return testRunner.registerSuite(name, suiteBody, UI.suiteCallbacks);
}

function before(initialization) {
  testRunner.registerBefore(initialization);
}

function runTesty(options) {
  requireDir(options.directory);
  UI.measure('total time', () => testRunner.run());
  testRunner.finish({
    success: () => process.exit(0),
    failure: () => process.exit(1),
  });
}

module.exports = Object.assign(
  { runTesty: runTesty, suite: suite, test: test, before: before },
  testRunner.availableAssertions()
);
