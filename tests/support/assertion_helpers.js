import {assert, fail} from '../../lib/testy.js';
import { I18nMessage } from '../../lib/i18n/i18n_messages.js';
import { I18n } from '../../lib/i18n/i18n.js';
import {TestResult} from "../../lib/core/test_result.js";
const sourceCodeLocationRegex = /.* at .*:\d+:\d+/;

const expectSuccess = result => {
  // my status
  isSuccessfulTestResult(result);
  assert.isEmpty(result.location());
};

const isSuccessfulTestResult = (testResult) => {
  validateIsTestResult(testResult)
  const isSuccessfulTestResult = testResult.isSuccess();
  if(!isSuccessfulTestResult) {
    fail.reportFailure(testResult.hasFailureMessage() ? testResult.failureMessage() : I18nMessage.of('expected_test_result_fail', testResult.resultAsText()))
  }
  return testResult
}

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

const validateIsTestResult = (object) => {
  if (!(object instanceof TestResult)) throw new Error(I18nMessage.of('invalid_object_in_test_result_assertion', typeof object))
}
const validateIsExpectedFailureMessage = (actualFailureMessage, expectedFailureMessage) =>  {
  const actualMessage = actualFailureMessage instanceof I18nMessage ? actualFailureMessage.expressedIn(I18n.default()) : actualFailureMessage;
  const expectedMessage =  expectedFailureMessage instanceof I18nMessage ? expectedFailureMessage.expressedIn(I18n.default()) : expectedFailureMessage
  const isSameFailureMessage = actualMessage === expectedMessage
  if(!isSameFailureMessage) {
    fail.reportFailure(I18nMessage.of('expectation_wrong_failure_message', expectedMessage, actualMessage))
  }
}

const expectFailureOn = (result, failureMessage) => {
  validateIsTestResult(result)
  const isFailedTestResult = result.isFailure()
  if(!isFailedTestResult) {
    fail.reportFailure(I18nMessage.of('expectation_failure_to_happen'))
  }
  validateIsExpectedFailureMessage(result.failureMessage(), failureMessage)
  assert.that(result.location()).matches(sourceCodeLocationRegex);
  return result
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
