'use strict';

import { isFunction, isStringWithContent, isUndefined, shuffle } from '../utils.js';

/**
 * I represent a grouping of [tests]{@link Test} under a name, that will be executed by a
 * [runner]{@link TestRunner}. I can run some code [before]{@link TestSuite#before} and
 * [after]{@link TestSuite#after} each test.
 */
export class TestSuite {
  #name;
  #body;
  #tests;
  #currentTest;
  #callbacks;
  #before;
  #after;

  static BEFORE_HOOK_NAME = 'before';
  static AFTER_HOOK_NAME = 'after';

  // Error messages

  static invalidSuiteNameErrorMessage() {
    return 'Suite does not have a valid name. Please enter a non-empty string to name this suite.';
  }

  static invalidSuiteDefinitionBodyErrorMessage() {
    return 'Suite does not have a valid body. Please provide a function to declare the suite body.';
  }

  static alreadyDefinedHookErrorMessage(hookName) {
    return `There is already a ${hookName}() block. Please leave just one ${hookName}() block and run again the tests.`;
  }

  static hookWasNotInitializedWithAFunctionErrorMessage(hookName) {
    return `The ${hookName}() hook must include a function. Please provide a function or remove the ${hookName}() and run again the tests.`;
  }

  // Instance creation

  constructor(name, body, callbacks) {
    this.#initializeName(name);
    this.#initializeBody(body);
    this.#tests = [];
    this.#callbacks = callbacks;
    this.#before = undefined;
    this.#after = undefined;
  }

  // Initializing / Configuring

  /**
   * Adds a new test to the suite.
   *
   * @param {!Test} test the test we'd like to add.
   * @returns {void}
   */
  addTest(test) {
    this.#tests.push(test);
  }

  /**
   * Registers a piece of code that should be executed before each test. There should be one `before` per suite, so it
   * will fail if there's already a `before` block in the suite.
   *
   * @param {!Function} initializationBlock the code you'd like to execute before each test.
   * @returns {void}
   */
  before(initializationBlock) {
    this.#validateHook(TestSuite.BEFORE_HOOK_NAME, initializationBlock, this.#before);

    this.#before = initializationBlock;
  }

  /**
   * Registers a piece of code that should be executed after each test. There should be one `after` per suite, so it
   * will fail if there's already an `after` block in the suite.
   *
   * @param {!Function} releasingBlock the code you'd like to execute after each test.
   * @returns {void}
   */
  after(releasingBlock) {
    this.#validateHook(TestSuite.AFTER_HOOK_NAME, releasingBlock, this.#after);

    this.#after = releasingBlock;
  }

  // Executing

  async run(context) {
    this.#callbacks.onStart(this);
    this.#evaluateSuiteDefinition();
    await this.#runTests(context);
    this.#callbacks.onFinish(this);
  }

  // Counting

  totalCount() {
    return this.tests().length;
  }

  successCount() {
    return this.tests().filter(test => test.isSuccess()).length;
  }

  pendingCount() {
    return this.tests().filter(test => test.isPending()).length;
  }

  errorsCount() {
    return this.tests().filter(test => test.isError()).length;
  }

  skippedCount() {
    return this.tests().filter(test => test.isSkipped()).length;
  }

  explicitlySkippedCount() {
    return this.tests().filter(test => test.isExplicitlySkipped()).length;
  }

  failuresCount() {
    return this.totalCount() - this.successCount() - this.pendingCount() - this.errorsCount() - this.skippedCount() - this.explicitlySkippedCount();
  }

  // Accessing

  name() {
    return this.#name;
  }

  currentTest() {
    return this.#currentTest;
  }

  tests() {
    return this.#tests;
  }

  allFailuresAndErrors() {
    return this.tests().filter(test => test.isFailure() || test.isError());
  }

  // Private - Validations

  #initializeBody(body) {
    this.#ensureBodyIsValid(body);
    this.#body = body;
  }

  #initializeName(name) {
    this.#ensureNameIsValid(name);
    this.#name = name;
  }

  #ensureNameIsValid(name) {
    if (!isStringWithContent(name)) {
      throw new Error(TestSuite.invalidSuiteNameErrorMessage());
    }
  }

  #ensureBodyIsValid(body) {
    if (!isFunction(body)) {
      throw new Error(TestSuite.invalidSuiteDefinitionBodyErrorMessage());
    }
  }

  #validateHook(hookName, hookToSet, existingHook) {
    this.#validateTheHookIsNotAlreadyDeclared(existingHook, hookName);
    this.#validateTheHookBlockIsAFunction(hookToSet, hookName);
  }

  #validateTheHookIsNotAlreadyDeclared(hookBlock, hookName) {
    if (!isUndefined(hookBlock)) {
      throw new Error(TestSuite.alreadyDefinedHookErrorMessage(hookName));
    }
  }

  #validateTheHookBlockIsAFunction(hookBlock, hookName) {
    if (!isFunction(hookBlock)) {
      throw new Error(TestSuite.hookWasNotInitializedWithAFunctionErrorMessage(hookName));
    }
  }

  // Private - Running

  #randomizeTests() {
    shuffle(this.tests());
  }

  #evaluateSuiteDefinition() {
    this.#body.call();
  }

  async #runTests(context) {
    if (context.randomOrderMode) {
      this.#randomizeTests();
    }

    context.hooks = {
      [TestSuite.BEFORE_HOOK_NAME]: this.#before,
      [TestSuite.AFTER_HOOK_NAME]: this.#after,
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const test of this.tests()) {
      // NOTE: test will run in sequence, by design. The tool is not (yet) supporting parallel execution.
      this.#currentTest = test;

      await test.run(context);
    }
  }
}
