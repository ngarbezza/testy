'use strict';

const fs = require('fs');
const path = require('path');

const GUARDIAN_JSON_PATH = '/tmp/guardian.json';
const LINT_JSON_PATH = '/tmp/lint.json';
const EMPTY_GUARDIAN_RESULT = {
  violations: [],
  summary: { total: 0, byLayer: { 'zero-dependency': 0, 'metaprogramming': 0, 'fan-out': 0 } },
};

function safeReadJson(filePath, fallback) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (_err) {
    return fallback;
  }
}

module.exports = async function run({ github, context, core }) {
  const guardianResult = safeReadJson(GUARDIAN_JSON_PATH, EMPTY_GUARDIAN_RESULT);
  const lintResult = safeReadJson(LINT_JSON_PATH, []);

  const postComment = require(path.join(__dirname, 'comment.cjs'));
  const hasViolations = await postComment({ github, context, core, guardianResult, lintResult });

  if (hasViolations) {
    core.setFailed('Simplicity violations found — see PR comment for details');
  }
};
