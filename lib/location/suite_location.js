import { isStringWithContent } from '../utils/index.js';

export class SuiteLocation {
  #path;

  static invalidSuiteFilePathErrorMessage() {
    return 'Suite Location does not have a valid file path. Please enter a valid file path string for this suite location.';
  }

  constructor(filePath) {
    SuiteLocation.#ensureFilePathIsValid(filePath);
    this.#path = filePath;
  }

  getPath() {
    return this.#path;
  }

  static #ensureFilePathIsValid(filePath) {
    if (!isStringWithContent(filePath)) {
      throw new Error(SuiteLocation.invalidSuiteFilePathErrorMessage());
    }
  }
}
