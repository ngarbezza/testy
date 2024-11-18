export class SuiteLocation {
  #locationPath;

  constructor(filePath) {
    this.#locationPath = filePath;
  }

  getPath() {
    return this.#locationPath;
  }
}
