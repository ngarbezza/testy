'use strict';

const TestRunner = require('./test_runner');
const { Asserter, FailureGenerator, PendingMarker } = require('./asserter');
const ConsoleUI = require('./console_ui');
const { allFilesMatching, resolvePathFor, errorDetailOf } = require('./utils');
const { I18nMessage } = require('./i18n');

const ui = new ConsoleUI(process, console);
const testRunner = new TestRunner(ui.testRunnerCallbacks());

/**
 * Object used for writing assertions. [Assertions]{@link Assertion} are created with method calls to this object.
 * Please refer to the comment of each assertion for more information.
 *
 * @example
 * assert.isFalse(3 > 4)
 * @example
 * assert.that(['hey']).isNotEmpty()
 *
 * @type {Asserter}
 */
const assert = new Asserter(testRunner);

/**
 * Generates an explicit failure.
 *
 * @example
 * fail.with('a descriptive message')
 *
 * @type {FailureGenerator}
 */
const fail = new FailureGenerator(testRunner);

/**
 * Marks a test as pending, which is a status that is reported separately, and it's not considered success/failure.
 * It is useful to mark in-progress work and catch the developers attention in the resulting report.
 *
 * @example
 * pending.dueTo('finish the set-up process')
 *
 * @type {PendingMarker}
 */
const pending = new PendingMarker(testRunner);

/**
 * Defines a new test. Each test belongs to a [test suite]{@link suite} and defines assertions in the body.
 *
 * For info about assertions, take a look at the {@link assert} object.
 *
 * Tests are represented internally as instances of {@link Test}.
 *
 * @example
 * test('arithmetic works', () => {
 *   assert.areEqual(3 + 4, 7);
 * });
 *
 * @param {!string} name how you would like to call the test. Non-empty string.
 * @param {!function} testBody the test definition, written as a zero-argument function.
 * @returns {void}
 */
function test(name, testBody) {
  testRunner.registerTest(name, testBody, ui.testCallbacks());
}

/**
 * Defines a new test suite. Suites are expected to define [tests]{@link test} inside it.
 * There can be more than one suite per file, but it is not possible to nest suites.
 *
 * @example
 * suite('arithmetic operations', () => {
 *   test('the sum of two number works', () => {
 *     assert.areEqual(3 + 4, 7);
 *   });
 * });
 *
 * @param {!string} name how you would like to call the suite. Non-empty string.
 * @param {!function} suiteBody the suite definition, written as a zero-argument function.
 * @returns {void}
 */
function suite(name, suiteBody) {
  testRunner.registerSuite(name, suiteBody, ui.suiteCallbacks());
}

/**
 * Specifies a piece of code that should be executed before each {@link test} in a {@link suite}.
 * Only one before block is allowed per suite. The most common use of this feature is to initialize objects you want
 * to reference in each test.
 *
 * @example
 * suite('using a before() initializer', () => {
 *   let number;
 *
 *   before(() => {
 *     number = 42;
 *   });
 *
 *   test('has the initialized value', () => {
 *     assert.that(number).isEqualTo(42);
 *   });
 * });
 *
 * @param {!function} initialization a zero argument function containing the code you want to execute before each test.
 * @returns {void}
 */
function before(initialization) {
  testRunner.registerBefore(initialization);
}

/**
 * Specifies a piece of code that should be executed after each {@link test} in a {@link suite}.
 * Only one after block is allowed per suite. The most common use of this feature is to ensure you are releasing
 * resources that are used on each test, like files.
 *
 * @param {!function} releaseBlock a zero argument function containing the code you want to execute after each test.
 * @returns {void}
 */
function after(releaseBlock) {
  testRunner.registerAfter(releaseBlock);
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

  async run(requestedPaths) {
    this._requestedPaths = requestedPaths;
    this._loadAllRequestedFiles();
    await ui.start(this._configuration, this._testFilesPathsToRun(), async() => {
      try {
        await testRunner.run();
      } catch (err) {
        ui.exitWithError(I18nMessage.of('error_running_suites'), errorDetailOf(err));
      }
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
    try {
      this._resolvedTestFilesPathsToRun().forEach(path =>
        this._loadAllFilesIn(path),
      );
    } catch (err) {
      ui.exitWithError(I18nMessage.of('error_path_not_found', err.path));
    }
  }

  _loadAllFilesIn(path) {
    allFilesMatching(path, this._testFilesFilter()).forEach(file =>
      this._loadFileHandlingErrors(file),
    );
  }

  _loadFileHandlingErrors(file) {
    try {
      require(file);
    } catch (err) {
      ui.exitWithError(
        I18nMessage.of('error_loading_suite', file), errorDetailOf(err),
        I18nMessage.of('feedback_for_error_loading_suite'),
      );
    }
  }

  _testFilesPathsToRun() {
    const requestedPaths = this._requestedPathsToRun();
    return requestedPaths.length > 0 ? requestedPaths : [this._pathForAllTests()];
  }

  _resolvedTestFilesPathsToRun() {
    return this._testFilesPathsToRun().map(path => resolvePathFor(path));
  }

  _pathForAllTests() {
    return this._configuration.directory();
  }

  _testFilesFilter() {
    return this._configuration.filter();
  }
}

module.exports = { Testy, suite, test, before, after, assert, fail, pending };