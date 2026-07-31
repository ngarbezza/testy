import { assert, after, before, suite, test } from '../../lib/testy.js';
import { NodeFileSystem } from '../../lib/host/file_system.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

suite('node file system', () => {
  let fileSystem, tempDir;

  before(() => {
    fileSystem = new NodeFileSystem();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'testy-fs-'));
    fs.writeFileSync(path.join(tempDir, 'a_test.js'), '');
    fs.writeFileSync(path.join(tempDir, 'helper.js'), '');
    fs.mkdirSync(path.join(tempDir, 'nested'));
    fs.writeFileSync(path.join(tempDir, 'nested', 'b_test.js'), '');
  });

  after(() => fs.rmSync(tempDir, { recursive: true, force: true }));

  test('finds files matching a pattern recursively', () => {
    const found = fileSystem.allFilesMatching(tempDir, /_test\.js$/u);
    assert.that(found.length).isEqualTo(2);
  });

  test('excludes files that do not match', () => {
    const found = fileSystem.allFilesMatching(tempDir, /_test\.js$/u);
    assert.that(found.some(file => file.endsWith('helper.js'))).isFalse();
  });

  test('resolves a relative path against the current working directory', () => {
    assert.that(fileSystem.resolvePathFor('x.json')).isEqualTo(path.resolve(process.cwd(), 'x.json'));
  });

  test('answers the extension of a path', () => {
    assert.that(fileSystem.extensionOf('/tmp/foo.ts')).isEqualTo('.ts');
  });

  test('deletes an existing file', () => {
    const target = path.join(tempDir, 'a_test.js');
    fileSystem.deleteFileIfExists(target);
    assert.that(fs.existsSync(target)).isFalse();
  });

  test('does nothing when deleting a missing file', () => {
    fileSystem.deleteFileIfExists(path.join(tempDir, 'ghost.js'));
    assert.isTrue(true);
  });
});
