import { createRequire } from 'node:module';
import path from 'node:path';
import { assert, suite, test } from '../../lib/testy.js';

// entrypoint.cjs uses CommonJS because it is loaded via require() inside actions/github-script
const require = createRequire(import.meta.url);
const { safeReadJson } = require('../../.github/scripts/simplicity-guardian/entrypoint.cjs');

const fixturePath = name => path.join(import.meta.dirname, 'fixtures', name);

suite('simplicity guardian entrypoint', () => {
  suite('safeReadJson', () => {
    test('returns the parsed content of a valid JSON file', () => {
      assert.that(safeReadJson(fixturePath('valid_report.json'), 'fallback')).isEqualTo({ violations: [] });
    });

    test('returns the fallback when the file does not exist', () => {
      assert.that(safeReadJson(fixturePath('missing_report.json'), 'fallback')).isEqualTo('fallback');
    });

    test('returns the fallback when the file is not valid JSON', () => {
      assert.that(safeReadJson(fixturePath('malformed_report.json'), 'fallback')).isEqualTo('fallback');
    });
  });
});
