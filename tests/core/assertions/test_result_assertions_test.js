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
});
