'use strict';

const { assert } = require('../../testy');
const TestResult = require('../../lib/test_result');

const expectSuccess = result => {
  assert.areEqual(result, TestResult.success());
};

const expectPendingResultOn = (result, reason) => {
  assert.isTrue(result.isPending());
  assert.areEqual(result.reason(), reason);
};

const expectFailureOn = (result, failureMessage) => {
  assert.isTrue(result.isFailure());
  assert.areEqual(result.failureMessage(), failureMessage);
};

const expectErrorOn = (result, errorMessage) => {
  assert.isTrue(result.isError());
  assert.areEqual(result.failureMessage(), errorMessage);
};

module.exports = {
  expectSuccess,
  expectFailureOn,
  expectErrorOn,
  expectPendingResultOn,
};
