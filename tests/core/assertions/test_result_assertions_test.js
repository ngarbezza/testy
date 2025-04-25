import { assert, suite, test } from '../../../lib/testy.js';
import { TestResult } from '../../../lib/core/test_result.js';
import { I18n } from '../../../lib/i18n/i18n.js';


suite('test result assertions', () => {
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
    const successfulTestResult = TestResult.success();
    assert.that(successfulTestResult.hasFailureMessage()).isFalse();
  });

  test('TestExplicitlyMarkedPending result does not have failure message', () => {
    const explicitlyMarkedPendingTestResult = TestResult.explicitlyMarkedAsPending('I am pending');
    assert.that(explicitlyMarkedPendingTestResult.hasFailureMessage()).isFalse();
  });

  test('ExplicitlySkippedTest result does not have failure message', () => {
    const explicitlySkippedTestResult = TestResult.explicitlySkip();
    assert.that(explicitlySkippedTestResult.hasFailureMessage()).isFalse();
  });

  test('TestErrored result as text is errored', () => {
    const erroredTestResult = TestResult.error('I got an error');
    const resultAsText = erroredTestResult.resultAsText().expressedIn(I18n.default());
    assert.that(resultAsText).isEqualTo('errored');
  });

  test('TestFailed result as text is failed', () => {
    const failedTestResult = TestResult.failure('I failed');
    const resultAsText = failedTestResult.resultAsText().expressedIn(I18n.default());
    assert.that(resultAsText).isEqualTo('failed');
  });

  test('TestSucceeded result as text is succeeded', () => {
    const successfulTestResult = TestResult.success();
    const resultAsText = successfulTestResult.resultAsText().expressedIn(I18n.default());
    assert.that(resultAsText).isEqualTo('succeeded');
  });

  test('TestExplicitlyMarkedPending result as text is explicitly marked as pending', () => {
    const explicitlyMarkedPendingTestResult = TestResult.explicitlyMarkedAsPending('I am pending');
    const resultAsText = explicitlyMarkedPendingTestResult.resultAsText().expressedIn(I18n.default());
    assert.that(resultAsText).isEqualTo('explicitly marked as pending');
  });
});
