import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

/**
 * I am the host file system. I expose, in domain terms, the file and path operations Testy
 * needs: find test files under a directory, resolve a path, answer a path's extension, read
 * a JSON document, and remove a temporary file. The core never names Node's fs/path APIs
 * directly. See decision 0018 (host capability catalog).
 */
export class NodeFileSystem {
  resolvePathFor(relativePath) {
    return path.resolve(process.cwd(), relativePath);
  }

  allFilesMatching(dir, regex) {
    if (fs.lstatSync(dir).isFile()) {
      return dir.match(regex) ? [dir] : [];
    }
    return fs.readdirSync(dir).flatMap(entry => this.allFilesMatching(path.join(dir, entry), regex));
  }

  extensionOf(filePath) {
    return path.extname(filePath);
  }

  deleteFileIfExists(filePath) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
}
