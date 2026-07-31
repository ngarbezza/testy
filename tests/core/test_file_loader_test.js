import { assert, suite, test, before } from '../../lib/testy.js';
import { TestFileLoader } from '../../lib/core/test_file_loader.js';
import { ConsoleUI } from '../../lib/ui/console_ui.js';
import { NodeFileSystem } from '../../lib/host/file_system.js';
import { NodeModuleLoader } from '../../lib/host/module_loader.js';
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

  test('uses the injected file system to discover files', async() => {
    await withRunner(async runner => {
      const seen = [];
      const recordingFileSystem = Object.assign(new NodeFileSystem(), {
        allFilesMatching(dir, regex) {
          seen.push(dir);
          return NodeFileSystem.prototype.allFilesMatching.call(this, dir, regex);
        },
      });
      const loader = new TestFileLoader(ui, runner, recordingFileSystem);

      await loader.loadAll([fixturesDir], /loader_fixture_ok\.js$/u);

      assert.that(seen.length).isGreaterThan(0);
    });
  });

  test('uses the injected module loader to evaluate matched files', async() => {
    await withRunner(async runner => {
      const seen = [];
      const recordingModuleLoader = Object.assign(new NodeModuleLoader(), {
        load(filePath) {
          seen.push(filePath);
          return NodeModuleLoader.prototype.load.call(this, filePath);
        },
      });
      const loader = new TestFileLoader(ui, runner, new NodeFileSystem(), recordingModuleLoader);

      await loader.loadAll([fixturesDir], /loader_fixture_ok\.js$/u);

      assert.that(seen.length).isGreaterThan(0);
    });
  });
});
