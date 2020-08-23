'use strict';

const { assert } = require('../../testy');
const { Asserter } = require('../../lib/asserter');
const TestResult = require('../../lib/test_result');
const I18n = require('../../lib/i18n');

const fakeRunner = {
  setResultForCurrentTest(result) {
    this._result = result;
  },
  result() {
    return this._result;
  },
  reset() {
    this.setResultForCurrentTest(undefined);
  },
  _i18n: new I18n(),
};

const asserter = new Asserter(fakeRunner);

const expectSuccess = () => {
  assert.areEqual(fakeRunner.result(), TestResult.success());
  fakeRunner.reset();
};

const expectFailureDueTo = failureMessage => {
  expectFailureOn(fakeRunner, failureMessage);
  fakeRunner.reset();
};

const expectFailureOn = (test, failureMessage) => {
  assert.isTrue(test.result().isFailure());
  assert.areEqual(test.result().failureMessage(), failureMessage);
};

const expectErrorOn = (test, errorMessage) => {
  assert.isTrue(test.result().isError());
  assert.areEqual(test.result().failureMessage(), errorMessage);
};

module.exports = { asserter, expectSuccess, expectFailureDueTo, expectFailureOn, expectErrorOn };
