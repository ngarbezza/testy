'use strict';

const { suite, test, before, assert } = require('../../testy');

const ConsoleUI = require('../../lib/console_ui');
const FakeConsole = require('./fake_console');
const FakeProcess = require('./fake_process');

suite('Console UI', () => {
  let fakeProcess, fakeConsole;

  before(() => {
    fakeProcess = new FakeProcess();
    fakeConsole = new FakeConsole();
  });

  test('can exit with error displaying the given message', () => {
    const console = new ConsoleUI(fakeProcess, fakeConsole);
    console.exitWithError('a message');
    assert.that(fakeProcess.lastExitCode()).isEqualTo(ConsoleUI.failedExitCode());
    assert.that(fakeConsole.messages().length).isEqualTo(1);
    assert.that(fakeConsole.messages()[0]).matches(/a message/);
  });
});
