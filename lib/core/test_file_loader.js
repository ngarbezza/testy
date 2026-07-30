import fs from 'node:fs';
import pathUtils from 'node:path';
import { pathToFileURL } from 'node:url';
import { allFilesMatching, resolvePathFor, errorDetailOf } from '../utils/index.js';
import { I18nMessage } from '../i18n/i18n_messages.js';
import { TypescriptTranspiler } from '../typescript/typescript_transpiler.js';

/**
 * I discover, transpile (when needed), load and clean up the test files matching a
 * given set of paths and a filter. I am injected with `ui` and `testRunner` so I can
 * report progress and errors the same way `Testy` does. Extracting me out of `Testy`
 * keeps `lib/testy.js`'s import count under the Simplicity Guardian's fan-out
 * threshold (see decision 0017).
 */
export class TestFileLoader {
  #ui;
  #testRunner;

  constructor(ui, testRunner) {
    this.#ui = ui;
    this.#testRunner = testRunner;
  }

  async loadAll(requestedPaths, filterRegex) {
    try {
      // eslint-disable-next-line no-restricted-syntax
      for (const path of this.#resolvedPathsFor(requestedPaths)) {
        // eslint-disable-next-line no-await-in-loop
        await this.#loadAllFilesIn(path, filterRegex);
      }
    } catch (err) {
      this.#ui.exitWithError(I18nMessage.of('error_path_not_found', err.path));
    }
  }

  // private

  #resolvedPathsFor(paths) {
    return paths.map(path => resolvePathFor(path));
  }

  async #loadAllFilesIn(path, filterRegex) {
    // eslint-disable-next-line no-restricted-syntax
    for (const file of allFilesMatching(path, filterRegex)) {
      // eslint-disable-next-line no-await-in-loop
      await this.#loadFileHandlingErrors(file);
    }
  }

  // eslint-disable-next-line max-statements
  async #loadFileHandlingErrors(filePath) {
    let importPath = filePath;
    let isTempFileCreated = false;

    try {
      this.#testRunner.loadingFile(filePath);
      const fileExtension = pathUtils.extname(filePath);

      if (fileExtension === '.ts') {
        const transpilationResult = await TypescriptTranspiler.generateTemporalJavascriptFromTypescript(filePath);
        ({ importPath, isTempFileCreated } = transpilationResult);
      }

      const fileUrl = pathToFileURL(importPath);
      await import(fileUrl);
    } catch (err) {
      this.#ui.exitWithError(
        I18nMessage.of('error_loading_suite', filePath), errorDetailOf(err),
        I18nMessage.of('feedback_for_error_loading_suite'),
      );
    } finally {
      this.#cleanupTemporaryFile(isTempFileCreated, importPath);
    }
  }

  #cleanupTemporaryFile(shouldRemoveFile, path) {
    if (shouldRemoveFile && path && fs.existsSync(path)) {
      try {
        fs.unlinkSync(path);
      } catch (cleanupError) {
        this.#ui.exitWithError(
          I18nMessage.of('error_deleting_temporary_file', path), errorDetailOf(cleanupError),
        );
      }
    }
  }
}
