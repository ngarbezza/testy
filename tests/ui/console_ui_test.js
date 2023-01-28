'use strict';

const { suite, test, before, assert } = require('../../lib/testy');

const ConsoleUI = require('../../lib/ui/console_ui');
const FakeConsole = require('./fake_console');
const FakeProcess = require('./fake_process');
const Configuration = require('../../lib/config/configuration');

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

  test('successful exit code is zero', () => {
    assert.areEqual(ConsoleUI.successfulExitCode(), 0);
  });

  test('failed exit code is one', () => {
    assert.areEqual(ConsoleUI.failedExitCode(), 1);
  });

  test('prints start and end messages', async() => {
    const console = new ConsoleUI(fakeProcess, fakeConsole);
    const config = Configuration.current();
    await console.start(config, [], () => {});
    assert.that(fakeConsole.messages().length).isEqualTo(8);
    assert.that(fakeConsole.messages()[0]).matches(/timer started/);
    assert.that(fakeConsole.messages()[2]).matches(/Starting Testy!/);
    assert.that(fakeConsole.messages()[3]).matches(/Running tests in/);
    assert.that(fakeConsole.messages()[4]).matches(/Fail fast/);
    assert.that(fakeConsole.messages()[5]).matches(/Random order/);
    assert.that(fakeConsole.messages()[7]).matches(/timer ended/);
  });
});
