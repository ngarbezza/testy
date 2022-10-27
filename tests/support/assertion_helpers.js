'use strict';

const { assert } = require('../../testy');

const sourceCodeLocationRegex = /.* at .*:\d+:\d+/;

const expectSuccess = result => {
  assert.isTrue(result.isSuccess());
  assert.isEmpty(result.location());
};

const expectPendingResultOn = (result, reason) => {
  assert.isTrue(result.isPending());
  assert.isTrue(result.isExplicitlyMarkedPending());
  assert.areEqual(result.reason(), reason);
  assert.that(result.location()).matches(sourceCodeLocationRegex);
};

const expectFailureOn = (result, failureMessage) => {
  assert.isTrue(result.isFailure());
  assert.areEqual(result.failureMessage(), failureMessage);
  assert.that(result.location()).matches(sourceCodeLocationRegex);
};

const expectErrorOn = (result, errorMessage, locationRegex = sourceCodeLocationRegex) => {
  assert.isTrue(result.isError());
  assert.areEqual(result.failureMessage(), errorMessage);
  assert.that(result.location()).matches(locationRegex);
};

module.exports = {
  expectSuccess,
  expectFailureOn,
  expectErrorOn,
  expectPendingResultOn,
  sourceCodeLocationRegex,
};
