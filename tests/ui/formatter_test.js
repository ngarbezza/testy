'use strict';

import { assert, before, suite, test } from '../../lib/testy.js';
import { runSingleTest, withRunner } from '../support/runner_helpers.js';
import { aPendingTest, aTestWithBody } from '../support/tests_factory.js';

import { Formatter } from '../../lib/ui/formatter.js';
import { I18n } from '../../lib/i18n/i18n.js';
import { FakeConsole } from './fake_console.js';
import { sourceCodeLocationRegex } from '../support/assertion_helpers.js';

suite('formatter', () => {
  let formatter, fakeConsole, i18n;

  before(() => {
    fakeConsole = new FakeConsole();

    i18n = I18n.default();
    formatter = new Formatter(fakeConsole, i18n);
  });

  test('display errors in red', () => {
    formatter.displayError('things happened');
    const expectedErrorMessage = '\x1b[31mthings happened\x1b[0m';
    assert.that(fakeConsole.messages()).includesExactly(expectedErrorMessage);
  });

  test('display pending status in yellow including reason', async() => {
    await withRunner(async(runner, _assert, _fail, pending) => {
      const pendingTest = aTestWithBody(() => pending.dueTo('in a rush'));
      await runSingleTest(runner, pendingTest);
      formatter.displayPendingResult(pendingTest);
      const testResultMessage = '[\u001b[33m\u001b[1mWIP\u001b[0m] \u001b[33mjust a test\u001b[0m';
      const pendingReasonMessage = '  => in a rush';
      assert.that(fakeConsole.messages()).isEqualTo([testResultMessage, pendingReasonMessage]);
    });
  });

  test('display error status in red when not specifying a reason', async() => {
    await withRunner(async(runner, _assert, _fail, pending) => {
      const pendingTest = aTestWithBody(() => pending.dueTo());
      await runSingleTest(runner, pendingTest);
      formatter.displayFailureResult(pendingTest, 'error');
      const testResultMessage = '[\u001b[31m\u001b[1mERROR\u001b[0m] \u001b[31mjust a test\u001b[0m';
      const pendingReasonMessage = '  => In order to mark a test as pending, you need to specify a reason.';
      expectFailureMessagesIncludingSourceCodeLocation(testResultMessage, pendingReasonMessage);
    });
  });

  test('display failure status in red including reason', async() => {
    await withRunner(async(runner, _assert, fail) => {
      const failedTest = aTestWithBody(() => fail.with('I wanted to fail'));
      await runSingleTest(runner, failedTest);
      formatter.displayFailureResult(failedTest, 'fail');
      const testResultMessage = '[\u001b[31m\u001b[1mFAIL\u001b[0m] \u001b[31mjust a test\u001b[0m';
      const failureDetailMessage = '  => I wanted to fail';
      expectFailureMessagesIncludingSourceCodeLocation(testResultMessage, failureDetailMessage);
    });
  });

  test('display failure status in red including default explicit failure reason', async() => {
    await withRunner(async(runner, _assert, fail) => {
      const failedTest = aTestWithBody(() => fail.with());
      await runSingleTest(runner, failedTest);
      formatter.displayFailureResult(failedTest, 'fail');
      const testResultMessage = '[\u001b[31m\u001b[1mFAIL\u001b[0m] \u001b[31mjust a test\u001b[0m';
      const failureDetailMessage = '  => Explicitly failed';
      expectFailureMessagesIncludingSourceCodeLocation(testResultMessage, failureDetailMessage);
    });
  });

  test('display pending status in yellow and no reason if the test is empty', async() => {
    await withRunner(async runner => {
      const pendingTest = aPendingTest();
      await runSingleTest(runner, pendingTest);
      formatter.displayPendingResult(pendingTest);
      const testResultMessage = '[\u001b[33m\u001b[1mWIP\u001b[0m] \u001b[33ma work in progress\u001b[0m';
      assert.that(fakeConsole.messages()).includesExactly(testResultMessage);
    });
  });

  const expectFailureMessagesIncludingSourceCodeLocation = (testResultMessage, failureDetailMessage) => {
    assert.that(fakeConsole.messages().slice(0, 2)).isEqualTo([testResultMessage, failureDetailMessage]);
    assert.that(fakeConsole.messages()[2]).matches(sourceCodeLocationRegex);
  };
});
