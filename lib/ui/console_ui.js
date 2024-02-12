'use strict';

import { I18n } from '../i18n/i18n.js';
import { Formatter } from './formatter.js';

export class ConsoleUI {
  #process;
  #console;
  #formatter;

  static successfulExitCode() {
    return 0;
  }

  static failedExitCode() {
    return 1;
  }

  // instance creation

  constructor(process, console) {
    this.#process = process;
    this.#console = console;
    this.useLanguage(I18n.defaultLanguage());
  }

  // Callbacks for runner/suite/test

  testCallbacks() {
    return {
      whenPending: test =>
        this.#formatter.displayPendingResult(test),
      whenSkipped: test =>
        this.#formatter.displaySkippedResult(test),
      whenSuccess: test =>
        this.#formatter.displaySuccessResult(test),
      whenFailed: test =>
        this.#formatter.displayFailureResult(test, 'fail'),
      whenErrored: test =>
        this.#formatter.displayFailureResult(test, 'error'),
    };
  }

  suiteCallbacks() {
    return {
      onStart: suite =>
        this.#formatter.displaySuiteStart(suite),
      onFinish: suite =>
        this.#formatter.displaySuiteEnd(suite),
    };
  }

  testRunnerCallbacks() {
    return {
      onFinish: runner =>
        this.onRunnerFinish(runner),
      onSuccess: _runner =>
        this.#exitWithCode(ConsoleUI.successfulExitCode()),
      onFailure: _runner =>
        this.#exitWithCode(ConsoleUI.failedExitCode()),
    };
  }

  // application events

  async start(configuration, paths, runnerBlock) {
    this.#formatter.startTimer();
    this.#formatter.displayInitialInformation(configuration, paths);
    await runnerBlock.call();
  }

  useLanguage(language) {
    const i18n = new I18n(language);
    this.#formatter = new Formatter(this.#console, i18n);
  }

  exitWithError(...errorMessages) {
    errorMessages.forEach(errorMessage =>
      this.#formatter.displayError(errorMessage),
    );
    this.#exitWithCode(ConsoleUI.failedExitCode());
  }

  onRunnerFinish(runner) {
    this.#formatter.displayRunnerEnd(runner);
    this.#formatter.endTimer();
  }

  // private

  #exitWithCode(exitCode) {
    this.#process.exit(exitCode);
  }
}
