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
    this._loadAllRequestedFiles();

    return ui.measuringTotalTime(() =>
      testRunner.run()
    ).then(() =>
      testRunner.finish({
        success: () => process.exit(0),
        failure: () => process.exit(1),
      })
    );
  }
  
  _configureLanguageToUse() {
    const desiredLanguage = this._options.language;
    const languageToUse = desiredLanguage || I18n.defaultLanguage();
    ui.useLanguage(languageToUse);
    testRunner.useLanguage(languageToUse);
  }
  
  _configureFailFastMode() {
    const failFastChoice = this._options.failFast || false;
    testRunner.setFailFastMode(new FailFast(failFastChoice));
  }
  
  _requestedFileToRun() {
    // first argument on the command line, e.g: npm test my_file.js
    return process.argv[2];
  }
  
  _loadAllRequestedFiles() {
    const filesToRun = Utils.resolvePathFor(this._requestedFileToRun() || this._options.directory);
    Utils.allFilesMatching(filesToRun, this._testFilesFilter()).forEach(file =>
      require(file)
    );
  }
  
  _testFilesFilter() {
    return this._options.filter || /.*/;
  }
}

module.exports = { Testy, suite, test, before, assert, fail, pending };
