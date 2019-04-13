'use strict';

const libDir = './lib';
const requireDir = require('require-dir');
const TestRunner = require(`${libDir}/test_runner`);
const { Asserter, FailureGenerator } = require(`${libDir}/asserter`);
const ConsoleUI = require(`${libDir}/console_ui`);
const FailFast = require(`${libDir}/fail_fast`);
const I18n = require(`${libDir}/i18n`);

const ui = new ConsoleUI();
const testRunner = new TestRunner(ui.testRunnerCallbacks());
const assert = new Asserter(testRunner);
const fail = new FailureGenerator(testRunner);

function test(name, testBody) {
  testRunner.registerTest(name, testBody, ui.testCallbacks());
}

function suite(name, suiteBody) {
  return testRunner.registerSuite(name, suiteBody, ui.suiteCallbacks());
}

function before(initialization) {
  testRunner.registerBefore(initialization);
}

class Testy {
  static configuredWith(options) { return new Testy(options); }
  
  constructor(options) {
    requireDir(options.directory, { recurse: true });
    const languageToUse = options.language || I18n.defaultLanguage();
    ui.useLanguage(languageToUse);
    testRunner.useLanguage(languageToUse);
    testRunner.setFailFastMode(new FailFast(options.failFast || false));
  }
  
  run() {
    ui.measuringTotalTime(() => testRunner.run());
    testRunner.finish({
      success: () => process.exit(0),
      failure: () => process.exit(1),
    });
  }
}

module.exports = { Testy, suite, test, before, assert, fail };
