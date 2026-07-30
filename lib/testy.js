import { errorDetailOf } from './utils/index.js';
import { I18nMessage } from './i18n/i18n_messages.js';
import { TestFileLoader } from './core/test_file_loader.js';
import { ui, testRunner } from './dsl.js';

export { test, suite, before, after, assert, fail, pending } from './dsl.js';

class Testy {
  #configuration;
  #requestedPaths;
  #fileLoader;

  // instance creation

  static configuredWith(configuration) {
    return new Testy(configuration);
  }

  constructor(configuration) {
    this.#fileLoader = new TestFileLoader(ui, testRunner);
    this.#initializeConfiguredWith(configuration);
  }

  // running

  async run(requestedPaths) {
    this.#requestedPaths = requestedPaths;
    const pathsToRun = this.#testFilesPathsToRun();
    await this.#fileLoader.loadAll(pathsToRun, this.#configuration.filter());
    ui.start(this.#configuration, pathsToRun);
    try {
      await testRunner.run();
    } catch (err) {
      ui.exitWithError(I18nMessage.of('error_running_suites'), errorDetailOf(err));
    }
  }

  // initialization

  #initializeConfiguredWith(configuration) {
    this.#configuration = configuration;
    ui.configureWith(this.#configuration);
    testRunner.configureWith(this.#configuration);
  }

  // private

  #testFilesPathsToRun() {
    const requestedPaths = this.#requestedPaths;
    return requestedPaths.length > 0 ? requestedPaths : [this.#pathForAllTests()];
  }

  #pathForAllTests() {
    return this.#configuration.directory();
  }
}

export { Testy };
