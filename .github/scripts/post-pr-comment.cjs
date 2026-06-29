'use strict';

const COMMENT_MARKER = '<!-- simplicity-guardian -->';

function formatGuardianLayer(violations, layer, label) {
  const layerViolations = violations.filter(violation => violation.layer === layer);
  if (layerViolations.length === 0) {
    return `### ✅ ${label} — OK`;
  }
  const items = layerViolations.map(violation => `- \`${violation.file}:${violation.line}\` — ${violation.message}`).join('\n');
  return `### ❌ ${label} (${layerViolations.length})\n${items}`;
}

function formatEslintSection(lintResult) {
  const errors = lintResult.flatMap(file =>
    file.messages
      .filter(msg => msg.severity === 2)
      .map(msg => `- \`${file.filePath}:${msg.line}\` — ${msg.message}`)
  );
  if (errors.length === 0) {
    return '### ✅ ESLint — OK';
  }
  return `### ⚠️ ESLint — ${errors.length} violation(s)\n${errors.join('\n')}`;
}

function buildViolationsComment(guardianResult, lintResult) {
  const { violations } = guardianResult;
  return [
    COMMENT_MARKER,
    '## 🛡️ Simplicity Guardian',
    '',
    formatGuardianLayer(violations, 'zero-dependency', 'Zero-dependency'),
    formatGuardianLayer(violations, 'dark-magic', 'No dark magic'),
    formatGuardianLayer(violations, 'fan-out', 'Fan-out'),
    formatEslintSection(lintResult),
  ].join('\n');
}

function buildCleanComment() {
  return [COMMENT_MARKER, '## 🛡️ Simplicity Guardian', '', '✅ All checks passed'].join('\n');
}

async function findExistingComment(github, context) {
  const { data: comments } = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
  });
  return comments.find(comment => comment.body.includes(COMMENT_MARKER)) ?? null;
}

async function upsertComment(github, context, body, existingComment) {
  if (existingComment) {
    await github.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: existingComment.id,
      body,
    });
  } else {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body,
    });
  }
}

module.exports = async function postPrComment({ github, context, core, guardianResult, lintResult }) {
  const eslintErrors = lintResult.flatMap(file => file.messages.filter(msg => msg.severity === 2)).length;
  const hasViolations = guardianResult.summary.total > 0 || eslintErrors > 0;

  const existingComment = await findExistingComment(github, context);

  if (hasViolations) {
    const body = buildViolationsComment(guardianResult, lintResult);
    await upsertComment(github, context, body, existingComment);
    core.info(`Simplicity Guardian: ${guardianResult.summary.total} guardian violation(s), ${eslintErrors} ESLint error(s)`);
  } else if (existingComment) {
    await upsertComment(github, context, buildCleanComment(), existingComment);
    core.info('Simplicity Guardian: all checks passed — comment updated');
  } else {
    core.info('Simplicity Guardian: all checks passed');
  }

  return hasViolations;
};

module.exports.buildViolationsComment = buildViolationsComment;
module.exports.buildCleanComment = buildCleanComment;
module.exports.formatGuardianLayer = formatGuardianLayer;
module.exports.formatEslintSection = formatEslintSection;
