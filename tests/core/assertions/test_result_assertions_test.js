import { assert, suite, test } from '../../../lib/testy.js';
import { TestResult } from '../../../lib/core/test_result.js';
import { expectFailureOn, expectSuccess } from '../../support/assertion_helpers.js';
import { I18nMessage } from '../../../lib/i18n/i18n_messages.js';


suite('test result assertions', () => {
  test('expectSuccess passes if the sent test is successful', () => {
    const testResult = TestResult.success();
    expectSuccess(testResult);
  });

  test('expectSuccess fails if sent object is not a test result', () => {
    assert.that(() => expectSuccess(3)).raises(new Error(I18nMessage.of('invalid_object_in_test_result_assertion', typeof 3)));
  });

  test('expectSuccess passes if test is failed', () => {
    const testResult = TestResult.failure('I failed');
    expectFailureOn(testResult, 'I failed');
  });

  test('expectFailure fails if sent object is not a test result', () => {
    assert.that(() => expectFailureOn(3, 'failureMessage')).raises(new Error(I18nMessage.of('invalid_object_in_test_result_assertion', typeof 3)));
  });

  test('TestFailed result has failure message', () => {
    const failedTestResult = TestResult.failure('I failed');
    assert.that(failedTestResult.hasFailureMessage()).isTrue();
    assert.that(failedTestResult.failureMessage()).isEqualTo('I failed');
  });

  test('TestErrored result has failure message', () => {
    const erroredTestResult = TestResult.error('I got an error');
    assert.that(erroredTestResult.hasFailureMessage()).isTrue();
    assert.that(erroredTestResult.failureMessage()).isEqualTo('I got an error');
  });

  test('TestSucceeded result does not have failure message', () => {
    const erroredTestResult = TestResult.success();
    assert.that(erroredTestResult.hasFailureMessage()).isFalse();
  });

  test('TestExplicitlyMarkedPending result does not have failure message', () => {
    const explicitlyMarkedPendingTestResult = TestResult.explicitlyMarkedAsPending('I am pending');
    assert.that(explicitlyMarkedPendingTestResult.hasFailureMessage()).isFalse();
  });

  test('ExplicitlySkippedTest result does not have failure message', () => {
    const explicitlySkippedTestResult = TestResult.explicitlySkip();
    assert.that(explicitlySkippedTestResult.hasFailureMessage()).isFalse();
  });
});
