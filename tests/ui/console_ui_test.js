import { assert, before, suite, test } from '../../lib/testy.js';

import { ConsoleUI } from '../../lib/ui/console_ui.js';
import { FakeConsole } from './fake_console.js';
import { FakeProcess } from './fake_process.js';
import { Configuration } from '../../lib/config/configuration.js';
import { emptyRunnerCallbacks, withRunnerAndCallbacks } from '../support/runner_helpers.js';

suite('Console UI', () => {
  let fakeProcess, fakeConsole, console;

  before(() => {
    fakeProcess = new FakeProcess();
    fakeConsole = new FakeConsole();
    console = new ConsoleUI(fakeProcess, fakeConsole);
  });

  test('can exit with error displaying the given message', () => {
    console.exitWithError('a message');
    assert.that(fakeProcess.lastExitCode()).isEqualTo(ConsoleUI.failedExitCode());
    assert.that(fakeConsole.messages().length).isEqualTo(1);
    assert.that(fakeConsole.messages().at(0)).matches(/a message/);
  });

  test('successful exit code is zero', () => {
    assert.areEqual(ConsoleUI.successfulExitCode(), 0);
  });

  test('failed exit code is one', () => {
    assert.areEqual(ConsoleUI.failedExitCode(), 1);
  });

  test('prints initial configuration on start', async() => {
    const config = Configuration.current();
    await console.start(config, [], () => {});
    assert.that(fakeConsole.messages().length).isEqualTo(7);
    assert.that(fakeConsole.messages().at(2)).matches(/Starting Testy!/);
    assert.that(fakeConsole.messages().at(3)).matches(/Running tests in/);
    assert.that(fakeConsole.messages().at(4)).matches(/Fail fast/);
    assert.that(fakeConsole.messages().at(5)).matches(/Random order/);
  });

  test('has a timer that ends at the end of the runner', async() => {
    const callbacks = {
      ...emptyRunnerCallbacks,
      onFinish: runner => {
        console.onRunnerFinish(runner);
      },
    };
    await withRunnerAndCallbacks(callbacks, async runner => {
      runner.run();
    });
    assert.that(fakeConsole.messages().at(-1)).isEqualTo('timer "Total time" ended');
  });
});
