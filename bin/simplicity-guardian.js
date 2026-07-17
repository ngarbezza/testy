#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const EXTERNAL_IMPORT_PATTERN = /^import\s+(?:.+?\s+from\s+)?['"](?!\.|\/|node:)(?<pkg>[^'"]+)['"]/u;
const FAN_OUT_THRESHOLD = 7;
// Object.defineProperty is also caught by ESLint no-restricted-syntax (AST-based).
// We keep it here too so the guardian produces a unified JSON report that drives the PR comment
// independently of ESLint's separate output.
const METAPROGRAMMING_PATTERNS = [
  { pattern: /new\s+Proxy\s*\(/u, label: 'Proxy' },
  { pattern: /Object\.definePropert(?:y|ies)\s*\(/u, label: 'Object.defineProperty' },
  { pattern: /__proto__\s*=/u, label: '__proto__ assignment' },
];

export function detectExternalImports(source, filePath) {
  return source.split('\n')
    .map((line, index) => ({ line, lineNumber: index + 1 }))
    .filter(({ line }) => EXTERNAL_IMPORT_PATTERN.test(line))
    .map(({ line, lineNumber }) => {
      const { pkg: packageName } = line.match(EXTERNAL_IMPORT_PATTERN)?.groups ?? {};
      return {
        layer: 'zero-dependency',
        file: filePath,
        line: lineNumber,
        message: `External import '${packageName ?? '(unknown)'}' — violates zero-dependency DNA`,
      };
    });
}

export function detectMetaprogramming(source, filePath) {
  return source.split('\n')
    .flatMap((line, index) =>
      METAPROGRAMMING_PATTERNS
        .filter(({ pattern }) => pattern.test(line))
        .map(({ label }) => ({
          layer: 'metaprogramming',
          file: filePath,
          line: index + 1,
          message: `'${label}' is a metaprogramming pattern — Testy avoids runtime interception`,
        })),
    );
}

export function detectHighFanOut(source, filePath) {
  // Count all imports regardless of source — total coupling is what matters
  const importCount = source.split('\n')
    .filter(line => /^import\s+.+?\s+from\s+/u.test(line))
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

export function analyzeFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  return [
    ...detectExternalImports(source, filePath),
    ...detectMetaprogramming(source, filePath),
    ...detectHighFanOut(source, filePath),
  ];
}

function collectFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .flatMap(entry => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return collectFiles(fullPath);
      }
      return entry.name.endsWith('.js') ? [fullPath] : [];
    });
}

export function buildSummary(violations) {
  return {
    total: violations.length,
    byLayer: {
      'zero-dependency': violations.filter(violation => violation.layer === 'zero-dependency').length,
      metaprogramming: violations.filter(violation => violation.layer === 'metaprogramming').length,
      'fan-out': violations.filter(violation => violation.layer === 'fan-out').length,
    },
  };
}

export function formatTextOutput(violations) {
  if (violations.length === 0) {
    return '✅ Simplicity Guardian: all checks passed\n';
  }
  const lines = violations.map(violation => `${violation.file}:${violation.line} [${violation.layer}] ${violation.message}`);
  return [...lines, `\n${violations.length} violation(s) found\n`].join('\n');
}

function run(dirs, format) {
  const violations = dirs.flatMap(collectFiles).flatMap(analyzeFile);
  const summary = buildSummary(violations);
  if (format === 'json') {
    process.stdout.write(`${JSON.stringify({ violations, summary }, null, 2)}\n`);
  } else {
    process.stdout.write(formatTextOutput(violations));
  }
  process.exit(violations.length > 0 ? 1 : 0);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const cliArgs = process.argv.slice(2);
  const formatIndex = cliArgs.indexOf('--format');
  const format = formatIndex === -1 ? 'text' : cliArgs[formatIndex + 1];
  const dirs = cliArgs.filter(arg => !arg.startsWith('--') && arg !== format);
  run(dirs.length > 0 ? dirs : ['lib', 'bin'], format);
}
