import { assert, before, suite, test } from '../../lib/testy.js';
import { aPassingTest, aFailingTest, anErroredTest, aPendingTest, anExplicitlySkippedTest } from '../support/tests_factory.js';
import { runResultsWith, driveFormatter } from '../support/formatter_helpers.js';
import { JsonFormatter } from '../../lib/ui/json_formatter.js';
import { I18n } from '../../lib/i18n/i18n.js';
import { FakeConsole } from './fake_console.js';
import { FakeClock } from '../support/fake_clock.js';

suite('json formatter', () => {
  let formatter, fakeConsole;

  const reportFrom = () => JSON.parse(fakeConsole.messages()[0]);

  before(() => {
    fakeConsole = new FakeConsole();
    formatter = new JsonFormatter(fakeConsole, I18n.default(), FakeClock.startingAt(1000, 1350));
  });

  test('emits exactly one JSON document', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('a suite', aPassingTest);
    driveFormatter(formatter, runner, ranSuite);
    assert.that(fakeConsole.messages().length).isEqualTo(1);
  });

  test('reports the tool name and a version string', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('a suite', aPassingTest);
    driveFormatter(formatter, runner, ranSuite);
    const report = reportFrom();
    assert.that(report.tool).isEqualTo('@pmoo/testy');
    assert.that(report.version).matches(/^\d+\.\d+\.\d+/);
  });

  test('summarizes counts across statuses', async() => {
    const { runner, suite: ranSuite } =
      await runResultsWith('a suite', aPassingTest, aFailingTest, anErroredTest, aPendingTest, anExplicitlySkippedTest);
    driveFormatter(formatter, runner, ranSuite);
    const { summary } = reportFrom();
    assert.that(summary.total).isEqualTo(5);
    assert.that(summary.passed).isEqualTo(1);
    assert.that(summary.failed).isEqualTo(1);
    assert.that(summary.errored).isEqualTo(1);
    assert.that(summary.pending).isEqualTo(1);
    assert.that(summary.skipped).isEqualTo(1);
    assert.that(summary.durationMs).isEqualTo(350);
  });

  test('records each test name, status, and the suite file', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('a suite', aPassingTest);
    driveFormatter(formatter, runner, ranSuite);
    const report = reportFrom();
    assert.that(report.suites.length).isEqualTo(1);
    assert.that(report.suites[0].name).isEqualTo('a suite');
    assert.that(report.suites[0].file).isEqualTo('I/am/a/fake/path/location');
    assert.that(report.suites[0].tests).includes({ name: 'a pure success', status: 'passed' });
  });

  test('includes a failure block for failed tests', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('a suite', aFailingTest);
    driveFormatter(formatter, runner, ranSuite);
    const [failedTest] = reportFrom().suites[0].tests;
    assert.that(failedTest.status).isEqualTo('failed');
    assert.that(failedTest.failure.message).isNotUndefined();
  });
});
