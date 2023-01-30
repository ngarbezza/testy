'use strict';

import { isFunction, isStringWithContent, isUndefined, shuffle } from '../utils.js';

export class TestSuite {
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
    this._initializeName(name);
    this._initializeBody(body);
    this._tests = [];
    this._callbacks = callbacks;
    this._before = undefined;
    this._after = undefined;
  }

  // Initializing / Configuring

  addTest(test) {
    this._tests.push(test);
  }

  before(initializationBlock) {
    this._validateTheHookIsNotAlreadyDeclared(this._before, TestSuite.BEFORE_HOOK_NAME);
    this._validateTheHookBlockIsAFunction(initializationBlock, TestSuite.BEFORE_HOOK_NAME);

    this._before = initializationBlock;
  }

  after(releasingBlock) {
    this._validateTheHookIsNotAlreadyDeclared(this._after, TestSuite.AFTER_HOOK_NAME);
    this._validateTheHookBlockIsAFunction(releasingBlock, TestSuite.AFTER_HOOK_NAME);

    this._after = releasingBlock;
  }

  // Executing

  async run(context) {
    this._callbacks.onStart(this);
    this._evaluateSuiteDefinition();
    await this._runTests(context);
    this._callbacks.onFinish(this);
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

  failuresCount() {
    return this.totalCount() - this.successCount() - this.pendingCount() - this.errorsCount() - this.skippedCount();
  }

  // Accessing

  name() {
    return this._name;
  }

  currentTest() {
    return this._currentTest;
  }

  tests() {
    return this._tests;
  }

  allFailuresAndErrors() {
    return this.tests().filter(test => test.isFailure() || test.isError());
  }

  // Private - Validations

  _initializeBody(body) {
    this._ensureBodyIsValid(body);
    this._body = body;
  }

  _initializeName(name) {
    this._ensureNameIsValid(name);
    this._name = name;
  }

  _ensureNameIsValid(name) {
    if (!isStringWithContent(name)) {
      throw new Error(TestSuite.invalidSuiteNameErrorMessage());
    }
  }

  _ensureBodyIsValid(body) {
    if (!isFunction(body)) {
      throw new Error(TestSuite.invalidSuiteDefinitionBodyErrorMessage());
    }
  }

  _validateTheHookIsNotAlreadyDeclared(hookBlock, hookName) {
    if (!isUndefined(hookBlock)) {
      throw new Error(TestSuite.alreadyDefinedHookErrorMessage(hookName));
    }
  }

  _validateTheHookBlockIsAFunction(hookBlock, hookName) {
    if (!isFunction(hookBlock)) {
      throw new Error(TestSuite.hookWasNotInitializedWithAFunctionErrorMessage(hookName));
    }
  }

  // Private - Running

  _randomizeTests() {
    shuffle(this.tests());
  }

  _evaluateSuiteDefinition() {
    this._body.call();
  }

  async _runTests(context) {
    if (context.randomOrderMode) {
      this._randomizeTests();
    }

    context.hooks = {
      [TestSuite.BEFORE_HOOK_NAME]: this._before,
      [TestSuite.AFTER_HOOK_NAME]: this._after,
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const test of this.tests()) {
      this._currentTest = test;

      await test.run(context);
    }
  }
}
