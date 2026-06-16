import { assert, before, suite, test } from '../../lib/testy.js';
import { aPassingTest, aFailingTest, anErroredTest, aPendingTest, anExplicitlySkippedTest } from '../support/tests_factory.js';
import { runResultsWith, driveFormatter } from '../support/formatter_helpers.js';
import { TapFormatter } from '../../lib/ui/tap_formatter.js';
import { I18n } from '../../lib/i18n/i18n.js';
import { FakeConsole } from './fake_console.js';

suite('tap formatter', () => {
  let formatter, fakeConsole;

  before(() => {
    fakeConsole = new FakeConsole();
    formatter = new TapFormatter(fakeConsole, I18n.default());
  });

  test('emits the TAP version header on initial information', () => {
    formatter.displayInitialInformation({}, ['tests']);
    assert.that(fakeConsole.messages()).includesExactly('TAP version 13');
  });

  test('emits ok lines for passing tests and a trailing plan', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('s', aPassingTest, aPassingTest);
    driveFormatter(formatter, runner, ranSuite);
    const messages = fakeConsole.messages();
    assert.that(messages).includes('ok 1 - a pure success');
    assert.that(messages).includes('ok 2 - a pure success');
    assert.that(messages).includes('1..2');
    assert.that(messages).includes('# pass 2');
  });

  test('emits a SKIP directive for skipped tests', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('s', anExplicitlySkippedTest);
    driveFormatter(formatter, runner, ranSuite);
    assert.that(fakeConsole.messages()).includes('ok 1 - a test that is skipped # SKIP');
  });

  test('emits a TODO directive for pending tests', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('s', aPendingTest);
    driveFormatter(formatter, runner, ranSuite);
    assert.that(fakeConsole.messages()).includes('ok 1 - a work in progress # TODO');
  });

  test('emits not ok plus a failure diagnostic block for failures', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('s', aFailingTest);
    driveFormatter(formatter, runner, ranSuite);
    const messages = fakeConsole.messages();
    assert.that(messages).includes('not ok 1 - a true failure');
    assert.that(messages).includes('  ---');
    assert.that(messages).includes('  severity: failure');
    assert.that(messages).includes('# fail 1');
  });

  test('marks errors with severity error', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('s', anErroredTest);
    driveFormatter(formatter, runner, ranSuite);
    const messages = fakeConsole.messages();
    assert.that(messages).includes('not ok 1 - an unexpected error');
    assert.that(messages).includes('  severity: error');
    assert.that(messages).includes('# error 1');
  });
});
