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
  _i18n: new I18n(),
};

const asserter = new Asserter(fakeRunner);

function expectSuccess() {
  assert.areEqual(fakeRunner.result(), TestResult.success());
}

function expectFailureDueTo(failureMessage) {
  assert.isTrue(fakeRunner.result().isFailure());
  assert.areEqual(fakeRunner.result().failureMessage(), failureMessage);
}

module.exports = { asserter, expectSuccess, expectFailureDueTo };
