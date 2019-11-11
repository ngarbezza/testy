'use strict';

const fs = require('fs');
const path = require('path');
const libDir = './lib';
const TestRunner = require(`${libDir}/test_runner`);
const { Asserter, FailureGenerator, PendingMarker } = require(`${libDir}/asserter`);
const ConsoleUI = require(`${libDir}/console_ui`);
const FailFast = require(`${libDir}/fail_fast`);
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
    this._options = options;
  }
  
  run() {
    this._configureLanguageToUse();
    this._configureFailFastMode();
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
    const failFastChoice = this._options.failFast || false;
    testRunner.setFailFastMode(new FailFast(failFastChoice));
  }
  
  _requestedFileToRun() {
    // first argument on the command line, e.g: npm test my_file.js
    return process.argv[2];
  }
  
  _loadAllRequestedFiles() {
    const filesToRun = this._resolvePathFor(this._requestedFileToRun() || this._options.directory);
    allFilesIn(filesToRun).forEach(file =>
      require(file)
    );
  }
  
  _resolvePathFor(relativePath) {
    return path.resolve(process.cwd(), relativePath);
  }
}

module.exports = { Testy, suite, test, before, assert, fail, pending };
