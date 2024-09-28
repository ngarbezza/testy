import { I18n } from '../i18n/i18n.js';
import { Formatter } from './formatter.js';

/**
 * I am a command-line user interface, connected to Node's `console`.
 *
 * I deal with all the relevant events and decide what to display to the user.
 * For that task, I collaborate with a [formatter]{@link Formatter}.
 */
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
    this.#useLanguage(I18n.defaultLanguage());
  }

  // configuration

  configureWith(configuration) {
    this.#useLanguage(configuration.language());
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
        this.#onRunnerFinish(runner),
      onSuccess: _runner =>
        this.#exitWithCode(ConsoleUI.successfulExitCode()),
      onFailure: _runner =>
        this.#exitWithCode(ConsoleUI.failedExitCode()),
    };
  }

  // application events

  start(configuration, paths) {
    this.#formatter.startTimer();
    this.#formatter.displayInitialInformation(configuration, paths);
  }

  exitWithError(...errorMessages) {
    errorMessages.forEach(errorMessage =>
      this.#formatter.displayError(errorMessage),
    );
    this.#exitWithCode(ConsoleUI.failedExitCode());
  }

  // private

  #useLanguage(language) {
    const i18n = new I18n(language);
    this.#formatter = new Formatter(this.#console, i18n);
  }

  #onRunnerFinish(runner) {
    this.#formatter.displayRunnerEnd(runner);
    this.#formatter.endTimer();
  }

  #exitWithCode(exitCode) {
    this.#process.exit(exitCode);
  }
}
