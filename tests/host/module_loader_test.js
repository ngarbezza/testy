import { assert, after, before, fail, suite, test } from '../../lib/testy.js';
import { NodeModuleLoader } from '../../lib/host/module_loader.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

suite('node module loader', () => {
  let loader, tempDir;

  before(() => {
    loader = new NodeModuleLoader();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'testy-loader-'));
  });

  after(() => fs.rmSync(tempDir, { recursive: true, force: true }));

  test('evaluates the module at the given path', async() => {
    const marker = path.join(tempDir, 'marker.js');
    const flag = path.join(tempDir, 'loaded.txt');
    fs.writeFileSync(marker, `import fs from 'node:fs'; fs.writeFileSync(${JSON.stringify(flag)}, 'yes');`);
    await loader.load(marker);
    assert.that(fs.readFileSync(flag, 'utf8')).isEqualTo('yes');
  });

  test('propagates errors from a broken module', async() => {
    const broken = path.join(tempDir, 'broken.js');
    fs.writeFileSync(broken, 'throw new Error("boom");');
    try {
      await loader.load(broken);
      fail.with('expected load to reject');
    } catch (error) {
      assert.that(error.message).isEqualTo('boom');
    }
  });
});
