import { assert } from '../../lib/testy.js';
import { I18nMessage } from '../../lib/i18n/i18n_messages.js';
import { I18n } from '../../lib/i18n/i18n.js';
import { TestWithDefinition } from '../../lib/core/test_result.js';
import { classNameOf } from '../../lib/utils/index.js';

const sourceCodeLocationRegex = /.* at .*:\d+:\d+/;

const expectSuccess = result => {
  // my status
  isSuccessfulTestResult(result);
  assert.isEmpty(result.location());
};

const isSuccessfulTestResult = testResult => {
  validateIsTestResult(testResult);
  assert
    .withDescription(`Expected test to be successful, got a ${getTestResultStatusMessage(testResult)} test instead`)
    .isTrue(testResult.isSuccess());
};

const getTestResultStatusMessage = testResult => testResult.resultAsText().expressedIn(I18n.default());
const expectPendingResultOn = (result, reason) => {
  // my status
  assert.isTrue(result.isPending());
  assert.isTrue(result.isExplicitlyMarkedPending());
  assert.areEqual(result.reason(), reason);
  assert.that(result.location()).matches(sourceCodeLocationRegex);

  // other statuses
  assert.isFalse(result.isSuccess());
  assert.isFalse(result.isSkipped());
  assert.isFalse(result.isFailure());
  assert.isFalse(result.isError());
};

const validateIsTestResult = object => {
  assert
    .withDescription(`Actual object needs to be a TestWithDefinition. Got ${classNameOf(object)} instead`)
    .isTrue(object instanceof TestWithDefinition);
};

const validateIsExpectedFailureMessage = (actualFailureMessage, expectedFailureMessage) => {
  const actualMessage = actualFailureMessage instanceof I18nMessage ? actualFailureMessage.expressedIn(I18n.default()) : actualFailureMessage;
  const expectedMessage = expectedFailureMessage instanceof I18nMessage ? expectedFailureMessage.expressedIn(I18n.default()) : expectedFailureMessage;
  assert.areEqual(actualMessage, expectedMessage);
};

const expectFailureOn = (result, failureMessage) => {
  validateIsTestResult(result);
  assert
    .withDescription(`Expected failure status, got ${getTestResultStatusMessage(result)}`)
    .isTrue(result.isFailure());
  validateIsExpectedFailureMessage(result.failureMessage(), failureMessage);
  assert.that(result.location()).matches(sourceCodeLocationRegex);
};

const expectErrorOn = (result, errorMessage, locationRegex = sourceCodeLocationRegex) => {
  // my status
  assert.isTrue(result.isError());
  assert.areEqual(result.failureMessage(), errorMessage);
  assert.that(result.location()).matches(locationRegex);

  // other statuses
  assert.isFalse(result.isSuccess());
  assert.isFalse(result.isFailure());
  assert.isFalse(result.isSkipped());
  assert.isFalse(result.isPending());

  if (errorMessage instanceof I18nMessage) {
    assert
      .that(() => errorMessage.associatedKeys().forEach(key => I18n.ensureKeyIsPresentOnAllLanguages(key)))
      .doesNotRaiseAnyErrors();
  }
};

export {
  expectSuccess,
  expectFailureOn,
  expectErrorOn,
  expectPendingResultOn,
  sourceCodeLocationRegex,
};
