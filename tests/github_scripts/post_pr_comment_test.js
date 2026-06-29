import { createRequire } from 'module';
import { assert, suite, test } from '../../lib/testy.js';

const require = createRequire(import.meta.url);
const script = require('../../.github/scripts/post-pr-comment.cjs');

const { buildViolationsComment, buildCleanComment, formatGuardianLayer, formatEslintSection } = script;

suite('post-pr-comment formatting', () => {
  suite('formatGuardianLayer', () => {
    test('returns OK line when no violations for layer', () => {
      const result = formatGuardianLayer([], 'zero-dependency', 'Zero-dependency');
      assert.that(result).isEqualTo('### ✅ Zero-dependency — OK');
    });

    test('returns violations list with count when violations exist', () => {
      const violations = [
        { layer: 'zero-dependency', file: 'lib/ui/formatter.js', line: 3, message: "External import 'chalk'" },
      ];
      const result = formatGuardianLayer(violations, 'zero-dependency', 'Zero-dependency');
      assert.that(result).isEqualTo("### ❌ Zero-dependency (1)\n- `lib/ui/formatter.js:3` — External import 'chalk'");
    });

    test('filters violations by layer', () => {
      const violations = [
        { layer: 'dark-magic', file: 'lib/core/test.js', line: 5, message: 'Proxy is dark magic' },
        { layer: 'zero-dependency', file: 'lib/ui/formatter.js', line: 3, message: "External import 'chalk'" },
      ];
      const result = formatGuardianLayer(violations, 'zero-dependency', 'Zero-dependency');
      assert.that(result).isEqualTo("### ❌ Zero-dependency (1)\n- `lib/ui/formatter.js:3` — External import 'chalk'");
    });
  });

  suite('formatEslintSection', () => {
    test('returns OK line when no ESLint errors', () => {
      const result = formatEslintSection([]);
      assert.that(result).isEqualTo('### ✅ ESLint — OK');
    });

    test('returns violations list when ESLint errors exist', () => {
      const lintResult = [
        { filePath: 'lib/core/test.js', messages: [{ line: 45, severity: 2, message: 'complexity of 8' }] },
      ];
      const result = formatEslintSection(lintResult);
      assert.that(result).isEqualTo('### ⚠️ ESLint — 1 violation(s)\n- `lib/core/test.js:45` — complexity of 8');
    });

    test('ignores ESLint warnings (severity 1)', () => {
      const lintResult = [
        { filePath: 'lib/core/test.js', messages: [{ line: 45, severity: 1, message: 'warning' }] },
      ];
      const result = formatEslintSection(lintResult);
      assert.that(result).isEqualTo('### ✅ ESLint — OK');
    });
  });

  suite('buildViolationsComment', () => {
    test('includes comment marker', () => {
      const guardianResult = { violations: [], summary: { total: 0, byLayer: {} } };
      const result = buildViolationsComment(guardianResult, []);
      assert.that(result.includes('<!-- simplicity-guardian -->')).isTrue();
    });

    test('includes guardian header', () => {
      const guardianResult = { violations: [], summary: { total: 0, byLayer: {} } };
      const result = buildViolationsComment(guardianResult, []);
      assert.that(result.includes('## 🛡️ Simplicity Guardian')).isTrue();
    });
  });

  suite('buildCleanComment', () => {
    test('includes comment marker', () => {
      const result = buildCleanComment();
      assert.that(result.includes('<!-- simplicity-guardian -->')).isTrue();
    });

    test('includes all checks passed message', () => {
      const result = buildCleanComment();
      assert.that(result.includes('✅ All checks passed')).isTrue();
    });
  });
});
