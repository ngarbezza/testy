import { assert, fail, suite, test, withTempDir } from '../../lib/testy.js';
import fs from 'node:fs';

suite('withTempDir', () => {
  test('gives the body an existing directory', () => withTempDir(tempDir => {
    assert.that(fs.existsSync(tempDir.path())).isTrue();
  }));

  test('answers the value returned by the body', async() => {
    const answer = await withTempDir(() => 42);
    assert.that(answer).isEqualTo(42);
  });

  test('removes the directory with its contents when the body finishes', async() => {
    let created;
    await withTempDir(tempDir => {
      created = tempDir.path();
      tempDir.writeFile('inside.txt', 'content');
    });
    assert.that(fs.existsSync(created)).isFalse();
  });

  test('waits for an asynchronous body before removing the directory', async() => {
    let created;
    await withTempDir(async tempDir => {
      created = tempDir.path();
      await Promise.resolve();
      assert.that(fs.existsSync(created)).isTrue();
    });
    assert.that(fs.existsSync(created)).isFalse();
  });

  test('removes the directory and propagates the error when the body throws', async() => {
    let created;
    try {
      await withTempDir(tempDir => {
        created = tempDir.path();
        throw new Error('boom');
      });
      fail.with('expected withTempDir to reject');
    } catch (error) {
      assert.that(error.message).isEqualTo('boom');
    }
    assert.that(fs.existsSync(created)).isFalse();
  });

  test('gives a different directory to each call', async() => {
    const first = await withTempDir(tempDir => tempDir.path());
    const second = await withTempDir(tempDir => tempDir.path());
    assert.that(first).isNotEqualTo(second);
  });
});
