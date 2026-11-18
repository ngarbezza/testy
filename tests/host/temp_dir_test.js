import { after, assert, before, suite, test } from '../../lib/testy.js';
import { TempDir } from '../../lib/host/temp_dir.js';
import fs from 'node:fs';
import path from 'node:path';

suite('temp dir', () => {
  let tempDir;

  before(() => {
    tempDir = TempDir.create();
  });

  after(() => tempDir.remove());

  test('creates an existing directory', () => {
    assert.that(fs.statSync(tempDir.path()).isDirectory()).isTrue();
  });

  test('creates a different directory on every call', () => {
    const another = TempDir.create();
    try {
      assert.that(another.path()).isNotEqualTo(tempDir.path());
    } finally {
      another.remove();
    }
  });

  test('answers the path of an entry inside the directory', () => {
    assert.that(tempDir.pathTo('nested', 'a.txt')).isEqualTo(path.join(tempDir.path(), 'nested', 'a.txt'));
  });

  test('writes a file and answers its path', () => {
    const written = tempDir.writeFile('a.txt', 'hello');
    assert.that(written).isEqualTo(tempDir.pathTo('a.txt'));
    assert.that(fs.readFileSync(written, 'utf8')).isEqualTo('hello');
  });

  test('creates missing subdirectories when writing a file', () => {
    tempDir.writeFile(path.join('deep', 'er', 'b.txt'), 'nested');
    assert.that(fs.existsSync(tempDir.pathTo('deep', 'er', 'b.txt'))).isTrue();
  });

  test('reads back what was written', () => {
    tempDir.writeFile('c.txt', 'round trip');
    assert.that(tempDir.readFile('c.txt')).isEqualTo('round trip');
  });

  test('removes the directory with its contents', () => {
    const disposable = TempDir.create();
    disposable.writeFile(path.join('sub', 'd.txt'), 'bye');
    disposable.remove();
    assert.that(fs.existsSync(disposable.path())).isFalse();
  });

  test('can be removed twice without failing', () => {
    const disposable = TempDir.create();
    disposable.remove();
    disposable.remove();
    assert.that(fs.existsSync(disposable.path())).isFalse();
  });
});
