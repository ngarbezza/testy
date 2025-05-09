import { isStringWithContent } from '../utils/index.js';

export class SuiteLocation {
  #path;

  static invalidSuiteFilePathErrorMessage() {
    return 'Suite Location does not have a valid file path. Please enter a valid file path string for this suite location.';
  }

  constructor(filePath) {
    this.#ensureFilePathIsValid(filePath);
    this.#path = filePath;
  }

  getPath() {
    return this.#path;
  }

  #ensureFilePathIsValid(filePath) {
    if (!isStringWithContent(filePath)) {
      throw new Error(SuiteLocation.invalidSuiteFilePathErrorMessage());
    }
  }
}
