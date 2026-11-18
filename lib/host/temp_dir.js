import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * I am a temporary directory: an isolated, unique place on the file system where a test can
 * create and read files without leaving garbage behind. Use me through {@link withTempDir},
 * which removes me when the test body finishes, even if it fails.
 *
 * I only answer in terms of paths relative to myself, so tests never have to join paths by hand.
 */
export class TempDir {
  #path;

  /**
   * Creates a new, unique, empty temporary directory.
   *
   * @returns {TempDir} a directory that exists on the file system until {@link TempDir#remove} is sent.
   */
  static create() {
    return new TempDir(fs.mkdtempSync(path.join(os.tmpdir(), 'testy-')));
  }

  constructor(directoryPath) {
    this.#path = directoryPath;
  }

  /**
   * @returns {string} the absolute path of this directory.
   */
  path() {
    return this.#path;
  }

  /**
   * @param {...string} segments the path segments of an entry, relative to this directory.
   * @returns {string} the absolute path of that entry. The entry is not required to exist.
   */
  pathTo(...segments) {
    return path.join(this.#path, ...segments);
  }

  /**
   * Writes a text file inside this directory, creating any missing subdirectory.
   *
   * @param {!string} relativePath where to write the file, relative to this directory.
   * @param {!string} content the text to write.
   * @returns {string} the absolute path of the written file.
   */
  writeFile(relativePath, content) {
    const target = this.pathTo(relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
    return target;
  }

  /**
   * @param {!string} relativePath the file to read, relative to this directory.
   * @returns {string} the UTF-8 content of the file.
   */
  readFile(relativePath) {
    return fs.readFileSync(this.pathTo(relativePath), 'utf8');
  }

  /**
   * Deletes this directory and everything inside it. Removing a directory that is already gone does nothing.
   *
   * @returns {void}
   */
  remove() {
    fs.rmSync(this.#path, { recursive: true, force: true });
  }
}
