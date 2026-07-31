import { assert, suite, test, before } from '../../lib/testy.js';
import { ScriptAction } from '../../lib/script_action.js';
import { FakeProcess } from '../ui/fake_process.js';
import { FakeConsole } from '../ui/fake_console.js';

suite('ScriptAction', () => {
  let fakeProcess, fakeConsole;

  before(() => {
    fakeProcess = new FakeProcess();
    fakeConsole = new FakeConsole();
  });

  test('-v shows the version, reading it from package.json', async() => {
    const action = ScriptAction.for(['-v'], fakeProcess, fakeConsole);
    await action.execute();

    assert.that(fakeConsole.messages().length).isEqualTo(1);
    assert.that(fakeConsole.messages().at(0)).matches(/Testy version: \d+\.\d+\.\d+/);
    assert.that(fakeProcess.lastExitCode()).isEqualTo(0);
  });

  test('--help shows usage information', async() => {
    const action = ScriptAction.for(['--help'], fakeProcess, fakeConsole);
    await action.execute();

    assert.that(fakeConsole.messages().length).isEqualTo(1);
    assert.that(fakeConsole.messages().at(0)).matches(/Usage:/);
    assert.that(fakeProcess.lastExitCode()).isEqualTo(0);
  });
});
