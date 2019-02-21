'use strict';

const TestResult = {
  evaluate(test, context) {
    return [TestWithoutDefinition, TestWithDefinition].
    find(result => result.canHandle(test)).
    handle(test, context);
  },
};

const TestWithoutDefinition = {
  __proto__: TestResult,
  canHandle(test) { return !test.hasDefinition(); },
  handle(test) { test.markPending(); },
};

const TestWithDefinition = {
  __proto__: TestResult,
  canHandle(test) { return test.hasDefinition(); },
  
  handle(test, context) {
    test.evaluate(context);
    this._determineFinalTestResult(test);
  },
  
  _determineFinalTestResult(test) {
    const possibleResults = [TestWithoutAssertion, TestErrored, TestSucceeded, TestFailed];
    possibleResults.find(result => result.canHandle(test)).handle(test);
  },
};

const TestWithoutAssertion = {
  __proto__: TestWithDefinition,
  canHandle(test) { return test.hasNoResult(); },
  handle(test) { test.failBecauseOfNoAssertions(); },
};

const TestErrored = {
  __proto__: TestWithDefinition,
  canHandle(test) { return test.isError(); },
  handle(test) { test.finishWithError(); },
};

const TestSucceeded = {
  __proto__: TestWithDefinition,
  canHandle(test) { return test.isSuccess(); },
  handle(test) { test.finishWithSuccess(); },
};

const TestFailed = {
  __proto__: TestWithDefinition,
  canHandle() { return true; },
  handle(test) { test.finishWithFailure(); },
};

module.exports = TestResult;
