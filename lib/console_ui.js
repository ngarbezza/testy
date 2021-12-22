'use strict';

const { I18n } = require('./i18n');
const Formatter = require('./formatter');

class ConsoleUI {
  static successfulExitCode() {
    return 0;
  }

  static failedExitCode() {
    return 1;
  }

  // instance creation

  constructor(process, console) {
    this._process = process;
    this._console = console;
    this.useLanguage(I18n.defaultLanguage());
  }

  // Callbacks for runner/suite/test

  testCallbacks() {
    return {
      whenPending: test =>
        this._formatter.displayPendingResult(test),
      whenSkipped: test =>
        this._formatter.displaySkippedResult(test),
      whenSuccess: test =>
        this._formatter.displaySuccessResult(test),
      whenFailed: test =>
        this._formatter.displayFailureResult(test),
      whenErrored: test =>
        this._formatter.displayErrorResult(test),
    };
  }

  suiteCallbacks() {
    return {
      onStart: suite =>
        this._formatter.displaySuiteStart(suite),
      onFinish: suite =>
        this._formatter.displaySuiteEnd(suite),
    };
  }

  testRunnerCallbacks() {
    return {
      onFinish: runner =>
        this._formatter.displayRunnerEnd(runner),
      onSuccess: _runner =>
        this._exitWithCode(ConsoleUI.successfulExitCode()),
      onFailure: _runner =>
        this._exitWithCode(ConsoleUI.failedExitCode()),
    };
  }

  // application events

  async start(configuration, paths, runnerBlock) {
    this._formatter.start();
    this._formatter.displayInitialInformation(configuration, paths);
    await runnerBlock.call();
    this._formatter.end();
  }

  useLanguage(language) {
    const i18n = new I18n(language);
    this._formatter = new Formatter(this._console, i18n);
  }

  exitWithError(...errorMessages) {
    errorMessages.forEach(errorMessage =>
      this._formatter.displayError(errorMessage),
    );
    this._exitWithCode(ConsoleUI.failedExitCode());
  }

  // private

  _exitWithCode(exitCode) {
    this._process.exit(exitCode);
  }
}

module.exports = ConsoleUI;
