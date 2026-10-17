import { copyFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL, URL } from 'node:url';
import { assert, suite, test } from '../../lib/testy.js';
import { detectUserCallingLocation, errorDetailOf } from '../../lib/utils/errors.js';
import { sourceCodeLocationRegex } from '../support/assertion_helpers.js';

suite('error utilities', () => {
  test('errorDetailOf() returns stack trace if the thrown object is an error', () => {
    const thrownObject = new Error('oops I did it again');
    assert.areEqual(errorDetailOf(thrownObject), thrownObject.stack);
  });

  test('errorDetailOf() returns the string contents if the thrown object is a string', () => {
    const thrownObject = 'oops I did it again';
    assert.areEqual(errorDetailOf(thrownObject), 'oops I did it again');
  });

  test('errorDetailOf() returns the string representation if the thrown object is not a string', () => {
    const thrownObject = [1, 2, 3];
    assert.areEqual(errorDetailOf(thrownObject), '1,2,3');
  });

  test('detectUserCallingLocation() reports a valid location', () => {
    assert.that(detectUserCallingLocation()).matches(sourceCodeLocationRegex);
  });

  test('detectUserCallingLocation() finds the user caller from a renamed library checkout', async() => {
    const temporaryDirectory = await mkdtemp(join(tmpdir(), 'errors-'));
    try {
      const copiedModuleDirectory = join(temporaryDirectory, 'renamed-library', 'lib', 'utils');
      const copiedModulePath = join(copiedModuleDirectory, 'errors.js');
      await mkdir(copiedModuleDirectory, { recursive: true });
      await copyFile(fileURLToPath(new URL('../../lib/utils/errors.js', import.meta.url)), copiedModulePath);
      await copyFile(
        fileURLToPath(new URL('../../package.json', import.meta.url)),
        join(temporaryDirectory, 'renamed-library', 'package.json'),
      );
      const renamedCheckoutModule = await import(pathToFileURL(copiedModulePath).href);

      assert.that(renamedCheckoutModule.detectUserCallingLocation()).matches(/errors_test\.js:\d+:\d+/);
    } finally {
      await rm(temporaryDirectory, { recursive: true, force: true });
    }
  });
});
