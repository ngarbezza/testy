import { assert, fail, suite, test, withTempDir } from '../../lib/testy.js';
import { NodeModuleLoader } from '../../lib/host/module_loader.js';

suite('node module loader', () => {
  const loader = new NodeModuleLoader();

  test('evaluates the module at the given path', () => withTempDir(async tempDir => {
    const flag = tempDir.pathTo('loaded.txt');
    const marker = tempDir.writeFile(
      'marker.js',
      `import fs from 'node:fs'; fs.writeFileSync(${JSON.stringify(flag)}, 'yes');`,
    );
    await loader.load(marker);
    assert.that(tempDir.readFile('loaded.txt')).isEqualTo('yes');
  }));

  test('propagates errors from a broken module', () => withTempDir(async tempDir => {
    const broken = tempDir.writeFile('broken.js', 'throw new Error("boom");');
    try {
      await loader.load(broken);
      fail.with('expected load to reject');
    } catch (error) {
      assert.that(error.message).isEqualTo('boom');
    }
  }));
});
