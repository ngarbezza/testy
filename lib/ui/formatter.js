/* eslint-disable class-methods-use-this */
import { isString } from '../utils/index.js';

/**
 * I am the base of the formatter family. I define the protocol of events that a
 * {@link ConsoleUI} sends (lifecycle + display of test results) with no-op defaults,
 * and I provide protected helpers for my subclasses to print and translate text.
 *
 * Concrete subclasses: {@link ConsoleFormatter} (human output), {@link TapFormatter},
 * {@link JsonFormatter} (machine-readable output).
 */
export class Formatter {
  #console;
  #i18n;

  constructor(console, i18n) {
    this.#console = console;
    this.#i18n = i18n;
  }

  // protected helpers for subclasses

  print(text) {
    this.#console.log(text);
  }

  startConsoleTimer(name) {
    this.#console.time(name);
  }

  endConsoleTimer(name) {
    this.#console.timeEnd(name);
  }

  translated(key) {
    return this.#i18n.translate(key);
  }

  internationalized(text) {
    return isString(text) ? text : text.expressedIn(this.#i18n);
  }

  // event protocol — no-op defaults, overridden by subclasses as needed

  startTimer() {
    // no-op
  }

  endTimer() {
    // no-op
  }

  displayInitialInformation(_configuration, _paths) {
    // no-op
  }

  displaySuiteStart(_suite) {
    // no-op
  }

  displaySuiteEnd(_suite) {
    // no-op
  }

  displayPendingResult(_test) {
    // no-op
  }

  displaySkippedResult(_test) {
    // no-op
  }

  displaySuccessResult(_test) {
    // no-op
  }

  displayFailureResult(_test, _failType) {
    // no-op
  }

  displayRunnerEnd(_runner) {
    // no-op
  }

  displayError(_message) {
    // no-op
  }
}
