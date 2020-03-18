'use strict';

const libDir = './lib';
const TestRunner = require(`${libDir}/test_runner`);
const { Asserter, FailureGenerator, PendingMarker } = require(`${libDir}/asserter`);
const ConsoleUI = require(`${libDir}/console_ui`);
const FailFast = require(`${libDir}/fail_fast`);
const Utils = require(`${libDir}/utils`);
const I18n = require(`${libDir}/i18n`);

const ui = new ConsoleUI();
const testRunner = new TestRunner(ui.testRunnerCallbacks());
const assert = new Asserter(testRunner);
const fail = new FailureGenerator(testRunner);
const pending = new PendingMarker(testRunner);

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
  static configuredWith(options) {
    return new Testy(options);
  }
  
  constructor(options) {
    this._options = options;
  }
  
  run() {
    this._configureLanguageToUse();
    this._configureFailFastMode();
    this._configureTestRandomness();
    this._loadAllRequestedFiles();
    ui.measuringTotalTime(() =>
      testRunner.run()
    );
    testRunner.finish({
      success: () => process.exit(0),
      failure: () => process.exit(1),
    });
  }
  
  _configureLanguageToUse() {
    const desiredLanguage = this._options.language;
    const languageToUse = desiredLanguage || I18n.defaultLanguage();
    ui.useLanguage(languageToUse);
    testRunner.useLanguage(languageToUse);
  }
  
  _configureFailFastMode() {
    const failFastChoice = !!this._options.failFast;
    testRunner.setFailFastMode(new FailFast(failFastChoice));
  }
  
  _configureTestRandomness() {
    testRunner.setTestRandomness(!!this._options.randomOrder);
  }
  
  _requestedFilesToRun() {
    // getting arguments after "npm test", e.g: npm test my_file_one.js my_file_two.js
    return process.argv.slice(2);
  }
  
  _loadAllRequestedFiles() {
    this._testFilesPathsToRun().forEach(path =>
      Utils.allFilesMatching(path, this._testFilesFilter()).forEach(file =>
        require(file)
      )
    )
  }
  
  _testFilesPathsToRun() {
    const testFilesPaths = this._requestedFilesToRun() || [this._pathForAllTests()];
    return testFilesPaths.map(path => Utils.resolvePathFor(path));
  }
  
  _pathForAllTests() {
    return this._options.directory || './tests';
  }
  
  _testFilesFilter() {
    return this._options.filter || /.*/;
  }
}

module.exports = { Testy, suite, test, before, assert, fail, pending };
