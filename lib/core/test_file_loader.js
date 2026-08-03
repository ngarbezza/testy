import { errorDetailOf } from '../utils/index.js';
import { I18nMessage } from '../i18n/i18n_messages.js';
import { TypescriptTranspiler } from '../typescript/typescript_transpiler.js';
import { NodeFileSystem } from '../host/file_system.js';
import { NodeModuleLoader } from '../host/module_loader.js';

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
  #fileSystem;
  #moduleLoader;

  constructor(ui, testRunner, fileSystem = new NodeFileSystem(), moduleLoader = new NodeModuleLoader()) {
    this.#ui = ui;
    this.#testRunner = testRunner;
    this.#fileSystem = fileSystem;
    this.#moduleLoader = moduleLoader;
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
    return paths.map(path => this.#fileSystem.resolvePathFor(path));
  }

  async #loadAllFilesIn(path, filterRegex) {
    // eslint-disable-next-line no-restricted-syntax
    for (const file of this.#fileSystem.allFilesMatching(path, filterRegex)) {
      // eslint-disable-next-line no-await-in-loop
      await this.#loadFileHandlingErrors(file);
    }
  }

  // eslint-disable-next-line max-statements
  async #loadFileHandlingErrors(filePath) {
    let importPath = filePath;
    let temporaryFilePath = null;

    try {
      this.#testRunner.loadingFile(filePath);
      const fileExtension = this.#fileSystem.extensionOf(filePath);

      if (fileExtension === '.ts') {
        ({ importPath: temporaryFilePath } = await TypescriptTranspiler.generateTemporalJavascriptFromTypescript(filePath));
        importPath = temporaryFilePath;
      }

      await this.#moduleLoader.load(importPath);
    } catch (err) {
      this.#ui.exitWithError(
        I18nMessage.of('error_loading_suite', filePath), errorDetailOf(err),
        I18nMessage.of('feedback_for_error_loading_suite'),
      );
    } finally {
      this.#cleanupTemporaryFile(temporaryFilePath);
    }
  }

  #cleanupTemporaryFile(temporaryFilePath) {
    if (!temporaryFilePath) {
      return;
    }
    try {
      this.#fileSystem.deleteFileIfExists(temporaryFilePath);
    } catch (cleanupError) {
      this.#ui.exitWithError(
        I18nMessage.of('error_deleting_temporary_file', temporaryFilePath), errorDetailOf(cleanupError),
      );
    }
  }
}
