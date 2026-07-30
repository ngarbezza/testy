import { assert, suite, test, before } from '../../lib/testy.js';
import { TestFileLoader } from '../../lib/core/test_file_loader.js';
import { ConsoleUI } from '../../lib/ui/console_ui.js';
import { FakeProcess } from '../ui/fake_process.js';
import { FakeConsole } from '../ui/fake_console.js';
import { withRunner } from '../support/runner_helpers.js';

const fixturesDir = 'tests/core/fixtures';

suite('TestFileLoader', () => {
  let fakeProcess, fakeConsole, ui;

  before(() => {
    fakeProcess = new FakeProcess();
    fakeConsole = new FakeConsole();
    ui = new ConsoleUI(fakeProcess, fakeConsole);
  });

  test('loads every file matching the filter under the given path without reporting errors', async() => {
    await withRunner(async runner => {
      const loader = new TestFileLoader(ui, runner);

      await loader.loadAll([fixturesDir], /loader_fixture_ok\.js$/u);

      assert.that(fakeProcess.lastExitCode()).isNull();
    });
  });

  test('reports an error and exits when the requested path does not exist', async() => {
    await withRunner(async runner => {
      const loader = new TestFileLoader(ui, runner);

      await loader.loadAll(['tests/core/fixtures/does-not-exist'], /.*/u);

      assert.that(fakeProcess.lastExitCode()).isEqualTo(ConsoleUI.failedExitCode());
    });
  });

  test('reports an error and exits when a matched file throws on import', async() => {
    await withRunner(async runner => {
      const loader = new TestFileLoader(ui, runner);

      await loader.loadAll([fixturesDir], /loader_fixture_throws\.js$/u);

      assert.that(fakeProcess.lastExitCode()).isEqualTo(ConsoleUI.failedExitCode());
    });
  });
});
