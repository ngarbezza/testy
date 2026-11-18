import { assert, suite, test, withTempDir } from '../../lib/testy.js';
import { NodeFileSystem } from '../../lib/host/file_system.js';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

suite('node file system', () => {
  const fileSystem = new NodeFileSystem();

  const withFixtureDir = body => withTempDir(tempDir => {
    tempDir.writeFile('a_test.js', '');
    tempDir.writeFile('helper.js', '');
    tempDir.writeFile(path.join('nested', 'b_test.js'), '');
    return body(tempDir);
  });

  test('finds files matching a pattern recursively', () => withFixtureDir(tempDir => {
    const found = fileSystem.allFilesMatching(tempDir.path(), /_test\.js$/u);
    assert.that(found.length).isEqualTo(2);
  }));

  test('excludes files that do not match', () => withFixtureDir(tempDir => {
    const found = fileSystem.allFilesMatching(tempDir.path(), /_test\.js$/u);
    assert.that(found.some(file => file.endsWith('helper.js'))).isFalse();
  }));

  test('resolves a relative path against the current working directory', () => {
    assert.that(fileSystem.resolvePathFor('x.json')).isEqualTo(path.resolve(process.cwd(), 'x.json'));
  });

  test('answers the extension of a path', () => {
    assert.that(fileSystem.extensionOf('/tmp/foo.ts')).isEqualTo('.ts');
  });

  test('deletes an existing file', () => withFixtureDir(tempDir => {
    const target = tempDir.pathTo('a_test.js');
    fileSystem.deleteFileIfExists(target);
    assert.that(fs.existsSync(target)).isFalse();
  }));

  test('does nothing when deleting a missing file', () => withFixtureDir(tempDir => {
    fileSystem.deleteFileIfExists(tempDir.pathTo('ghost.js'));
    assert.isTrue(true);
  }));

  test('reads and parses a JSON document', () => withTempDir(tempDir => {
    const jsonFile = tempDir.writeFile('data.json', JSON.stringify({ name: 'testy', nested: { ok: true } }));
    assert.that(fileSystem.readJson(jsonFile)).isEqualTo({ name: 'testy', nested: { ok: true } });
  }));
});
