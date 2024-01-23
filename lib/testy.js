'use strict';

import { TestRunner } from './core/test_runner.js';
import { Asserter, FailureGenerator, PendingMarker } from './core/asserter.js';
import { ConsoleUI } from './ui/console_ui.js';
import { allFilesMatching, errorDetailOf, resolvePathFor } from './utils.js';
import { I18nMessage } from './i18n/i18n_messages.js';

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
  #configuration;
  #requestedPaths;

  // instance creation

  static configuredWith(configuration) {
    return new Testy(configuration);
  }

  constructor(configuration) {
    this.#initializeConfiguredWith(configuration);
  }

  // running

  async run(requestedPaths) {
    this.#requestedPaths = requestedPaths;
    await this.#loadAllRequestedFiles();
    await ui.start(this.#configuration, this.#testFilesPathsToRun(), async() => {
      try {
        await testRunner.run();
      } catch (err) {
        ui.exitWithError(I18nMessage.of('error_running_suites'), errorDetailOf(err));
      }
    });
  }

  // initialization

  #initializeConfiguredWith(configuration) {
    this.#configuration = configuration;
    this.#configuration.configureUI(ui);
    this.#configuration.configureTestRunner(testRunner);
  }

  // private

  async #loadAllRequestedFiles() {
    try {
      // eslint-disable-next-line no-restricted-syntax
      for (const path of this.#resolvedTestFilesPathsToRun()) {
        await this.#loadAllFilesIn(path);
      }
    } catch (err) {
      ui.exitWithError(I18nMessage.of('error_path_not_found', err.path));
    }
  }

  async #loadAllFilesIn(path) {
    // eslint-disable-next-line no-restricted-syntax
    for (const file of allFilesMatching(path, this.#testFilesFilter())) {
      await this.#loadFileHandlingErrors(file);
    }
  }

  async #loadFileHandlingErrors(file) {
    try {
      await import(file);
    } catch (err) {
      ui.exitWithError(
        I18nMessage.of('error_loading_suite', file), errorDetailOf(err),
        I18nMessage.of('feedback_for_error_loading_suite'),
      );
    }
  }

  #testFilesPathsToRun() {
    const requestedPaths = this.#requestedPaths;
    return requestedPaths.length > 0 ? requestedPaths : [this.#pathForAllTests()];
  }

  #resolvedTestFilesPathsToRun() {
    return this.#testFilesPathsToRun().map(path => resolvePathFor(path));
  }

  #pathForAllTests() {
    return this.#configuration.directory();
  }

  #testFilesFilter() {
    return this.#configuration.filter();
  }
}

export { Testy, suite, test, assert, fail, pending, before, after };
