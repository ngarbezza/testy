'use strict';

const libDir = './lib';
const TestRunner = require(`${libDir}/test_runner`);
const { Asserter, FailureGenerator, PendingMarker } = require(`${libDir}/asserter`);
const ConsoleUI = require(`${libDir}/console_ui`);
const Utils = require(`${libDir}/utils`);

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
  // instance creation
  
  static configuredWith(configuration) {
    return new Testy(configuration);
  }
  
  constructor(configuration) {
    this._initializeConfiguredWith(configuration);
  }
  
  // running
  
  run(requestedPaths) {
    this._requestedPaths = requestedPaths;
    this._loadAllRequestedFiles();
    ui.displayInitialSummary(this._configuration, this._testFilesPathsToRun());
    ui.measuringTotalTime(() =>
      testRunner.run()
    );
    testRunner.finish({
      success: () => process.exit(0),
      failure: () => process.exit(1),
    });
  }
  
  // initialization
  
  _initializeConfiguredWith(configuration) {
    this._configuration = configuration;
    this._configuration.configureUI(ui);
    this._configuration.configureTestRunner(testRunner);
  }
  
  // private
  
  _requestedPathsToRun() {
    return this._requestedPaths;
  }
  
  _loadAllRequestedFiles() {
    this._resolvedTestFilesPathsToRun().forEach(path =>
      Utils.allFilesMatching(path, this._testFilesFilter()).forEach(file =>
        require(file)
      )
    );
  }
  
  _testFilesPathsToRun() {
    const requestedPaths = this._requestedPathsToRun();
    return requestedPaths.length > 0 ? requestedPaths : [this._pathForAllTests()];
  }
  
  _resolvedTestFilesPathsToRun() {
    return this._testFilesPathsToRun().map(path => Utils.resolvePathFor(path));
  }
  
  _pathForAllTests() {
    return this._configuration.directory();
  }
  
  _testFilesFilter() {
    return this._configuration.filter();
  }
}

module.exports = { Testy, suite, test, before, assert, fail, pending };
