import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const resolvePathFor = relativePath =>
  path.resolve(process.cwd(), relativePath);

const allFilesMatching = (dir, regex, results = []) => {
  if (fs.lstatSync(dir).isFile()) {
    return dir.match(regex) ? [dir] : [];
  }
  fs.readdirSync(dir).forEach(entry =>
    results.push(...allFilesMatching(path.join(dir, entry), regex, results)),
  );
  return results;
};

export {
  resolvePathFor,
  allFilesMatching,
};
