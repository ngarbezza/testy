#!/usr/bin/env node

const EXTERNAL_IMPORT_PATTERN = /^import\s+.+\s+from\s+['"](?!\.|\/|node:)/u;
const FAN_OUT_THRESHOLD = 7;
const DARK_MAGIC_PATTERNS = [
  { pattern: /new\s+Proxy\s*\(/u, label: 'Proxy' },
  { pattern: /Object\.definePropert(?:y|ies)\s*\(/u, label: 'Object.defineProperty' },
  { pattern: /__proto__\s*=/u, label: '__proto__ assignment' },
];

export function detectExternalImports(source, filePath) {
  return source.split('\n')
    .map((line, index) => ({ line, lineNumber: index + 1 }))
    .filter(({ line }) => EXTERNAL_IMPORT_PATTERN.test(line))
    .map(({ line, lineNumber }) => {
      const [, packageName] = line.match(/from\s+['"](?<pkg>[^'"]+)['"]/u) ?? [];
      return {
        layer: 'zero-dependency',
        file: filePath,
        line: lineNumber,
        message: `External import '${packageName}' — violates zero-dependency DNA`,
      };
    });
}

export function detectDarkMagic(source, filePath) {
  return source.split('\n')
    .flatMap((line, index) =>
      DARK_MAGIC_PATTERNS
        .filter(({ pattern }) => pattern.test(line))
        .map(({ label }) => ({
          layer: 'dark-magic',
          file: filePath,
          line: index + 1,
          message: `'${label}' is dark magic — violates no-dark-magic DNA`,
        })),
    );
}

export function detectHighFanOut(source, filePath) {
  const importCount = source.split('\n')
    .filter(line => /^import\s+.+\s+from\s+/u.test(line))
    .length;
  if (importCount <= FAN_OUT_THRESHOLD) {
    return [];
  }
  return [{
    layer: 'fan-out',
    file: filePath,
    line: 1,
    message: `${importCount} imports exceed threshold of ${FAN_OUT_THRESHOLD} — class may be doing too much`,
  }];
}
