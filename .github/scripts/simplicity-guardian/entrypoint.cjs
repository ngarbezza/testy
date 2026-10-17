'use strict';

const fs = require('node:fs');
const path = require('node:path');

// The workflow writes both reports into the runner's private temp directory (RUNNER_TEMP), not a shared /tmp.
const GUARDIAN_JSON_FILE = 'guardian.json';
const LINT_JSON_FILE = 'lint.json';
const EMPTY_GUARDIAN_RESULT = {
  violations: [],
  summary: { total: 0, byLayer: { 'zero-dependency': 0, 'metaprogramming': 0, 'fan-out': 0 } },
};

function safeReadJson(filePath, fallback) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (_err) {
    // A missing or malformed report is not fatal here: the fallback lets the comment step report it.
    return fallback;
  }
}

module.exports = async function run({ github, context, core }) {
  const reportsDirectory = process.env.RUNNER_TEMP;
  const guardianResult = safeReadJson(path.join(reportsDirectory, GUARDIAN_JSON_FILE), EMPTY_GUARDIAN_RESULT);
  const lintResult = safeReadJson(path.join(reportsDirectory, LINT_JSON_FILE), []);

  const postComment = require(path.join(__dirname, 'comment.cjs'));
  const hasViolations = await postComment({ github, context, core, guardianResult, lintResult });

  if (hasViolations) {
    core.setFailed('Simplicity violations found — see PR comment for details');
  }
};

module.exports.safeReadJson = safeReadJson;
