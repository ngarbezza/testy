'use strict';

const fs = require('fs');
const path = require('path');
const libDir = './lib';
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

function allFilesIn(dir, results = []) {
  if (fs.lstatSync(dir).isFile()) return [dir];
  
  fs.readdirSync(dir).forEach(f =>
    results = results.concat(allFilesIn(path.join(dir, f), results))
  );
  return results;
}

class Testy {
  static configuredWith(options) {
    return new Testy(options);
  }
  
  constructor(options) {
    this._configureLanguageToUse(options.language);
    this._configureFailFastMode(options.failFast);
    this._loadAllSuitesFrom(options.directory);
  }
  
  run() {
    ui.measuringTotalTime(() =>
      testRunner.run()
    );
    testRunner.finish({
      success: () => process.exit(0),
      failure: () => process.exit(1),
    });
  }
  
  _configureLanguageToUse(desiredLanguage) {
    const languageToUse = desiredLanguage || I18n.defaultLanguage();
    ui.useLanguage(languageToUse);
    testRunner.useLanguage(languageToUse);
  }
  
  _configureFailFastMode(failFastChoice) {
    testRunner.setFailFastMode(new FailFast(failFastChoice || false));
  }
  
  _loadAllSuitesFrom(testsDirectory) {
    allFilesIn(testsDirectory).forEach(file =>
      require(file)
    );
  }
}

module.exports = { Testy, suite, test, before, assert, fail };
