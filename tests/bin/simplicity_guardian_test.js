import { assert, suite, test } from '../../lib/testy.js';
import {
  detectExternalImports,
  detectMetaprogramming,
  detectHighFanOut,
  analyzeFile,
  buildSummary,
  formatTextOutput,
} from '../../bin/simplicity-guardian.js';

suite('simplicity guardian — detection functions', () => {

  suite('detectExternalImports', () => {
    test('returns empty array for a relative import', async() => {
      const source = "import { foo } from './foo.js';";
      assert.that(detectExternalImports(source, 'lib/test.js')).isEmpty();
    });

    test('returns empty array for a node: built-in import', async() => {
      const source = "import fs from 'node:fs';";
      assert.that(detectExternalImports(source, 'lib/test.js')).isEmpty();
    });

    test('returns a violation for an external package import', async() => {
      const source = "import chalk from 'chalk';";
      const violations = detectExternalImports(source, 'lib/formatter.js');

      assert.that(violations.length).isEqualTo(1);
      assert.that(violations[0].layer).isEqualTo('zero-dependency');
      assert.that(violations[0].file).isEqualTo('lib/formatter.js');
      assert.that(violations[0].line).isEqualTo(1);
      assert.isTrue(violations[0].message.includes('chalk'));
    });

    test('detects violation on a specific line number', async() => {
      const source = "import fs from 'node:fs';\nimport chalk from 'chalk';";
      const violations = detectExternalImports(source, 'lib/test.js');

      assert.that(violations[0].line).isEqualTo(2);
    });

    test('returns empty array for an absolute path import', async() => {
      const source = "import { foo } from '/absolute/path.js';";
      assert.that(detectExternalImports(source, 'lib/test.js')).isEmpty();
    });

    test('detects a side-effect external import (without from clause)', async() => {
      const source = "import 'chalk';";
      const violations = detectExternalImports(source, 'lib/test.js');

      assert.that(violations.length).isEqualTo(1);
      assert.isTrue(violations[0].message.includes('chalk'));
    });
  });

  suite('detectMetaprogramming', () => {
    test('returns empty array for clean code', async() => {
      const source = 'const x = 42;';
      assert.that(detectMetaprogramming(source, 'lib/test.js')).isEmpty();
    });

    test('detects new Proxy', async() => {
      const source = 'const proxy = new Proxy(target, handler);';
      const violations = detectMetaprogramming(source, 'lib/test.js');

      assert.that(violations.length).isEqualTo(1);
      assert.that(violations[0].layer).isEqualTo('metaprogramming');
      assert.isTrue(violations[0].message.includes('Proxy'));
    });

    test('detects Object.defineProperty', async() => {
      const source = 'Object.defineProperty(obj, "key", { value: 1 });';
      const violations = detectMetaprogramming(source, 'lib/test.js');

      assert.that(violations.length).isEqualTo(1);
      assert.isTrue(violations[0].message.includes('Object.defineProperty'));
    });

    test('detects Object.defineProperties', async() => {
      const source = 'Object.defineProperties(obj, { key: { value: 1 } });';
      const violations = detectMetaprogramming(source, 'lib/test.js');

      assert.that(violations.length).isEqualTo(1);
      assert.isTrue(violations[0].message.includes('Object.defineProperty'));
    });

    test('detects multiple patterns in the same source', async() => {
      const source = [
        'const proxy = new Proxy(target, handler);',
        'obj.__proto__ = parent;',
      ].join('\n');
      const violations = detectMetaprogramming(source, 'lib/test.js');

      assert.that(violations.length).isEqualTo(2);
    });

    test('detects __proto__ assignment', async() => {
      const source = 'obj.__proto__ = parent;';
      const violations = detectMetaprogramming(source, 'lib/test.js');

      assert.that(violations.length).isEqualTo(1);
      assert.isTrue(violations[0].message.includes('__proto__'));
    });
  });

  suite('detectHighFanOut', () => {
    test('returns empty array when imports are within threshold', async() => {
      const source = [
        "import { a } from './a.js';",
        "import { b } from './b.js';",
      ].join('\n');
      assert.that(detectHighFanOut(source, 'lib/test.js')).isEmpty();
    });

    test('returns a violation when imports exceed threshold of 7', async() => {
      const imports = Array.from({ length: 8 }, (_item, index) =>
        `import { x${index} } from './x${index}.js';`,
      ).join('\n');
      const violations = detectHighFanOut(imports, 'lib/big.js');

      assert.that(violations.length).isEqualTo(1);
      assert.that(violations[0].layer).isEqualTo('fan-out');
      assert.that(violations[0].file).isEqualTo('lib/big.js');
      assert.isTrue(violations[0].message.includes('8'));
    });

    test('returns empty array when exactly at threshold (7 imports)', async() => {
      const imports = Array.from({ length: 7 }, (_item, index) =>
        `import { x${index} } from './x${index}.js';`,
      ).join('\n');
      assert.that(detectHighFanOut(imports, 'lib/test.js')).isEmpty();
    });
  });

  suite('analyzeFile', () => {
    test('returns no violations for the guardian script itself', async() => {
      const violations = analyzeFile('bin/simplicity-guardian.js');
      assert.that(violations).isEmpty();
    });

    test('returns violations when the file has metaprogramming patterns', async() => {
      const violations = analyzeFile('tests/bin/fixtures/metaprogramming_file.js');
      assert.that(violations.length).isEqualTo(1);
      assert.that(violations[0].layer).isEqualTo('metaprogramming');
    });
  });

  suite('buildSummary', () => {
    test('returns zero counts when there are no violations', async() => {
      const summary = buildSummary([]);
      assert.that(summary.total).isEqualTo(0);
      assert.that(summary.byLayer['zero-dependency']).isEqualTo(0);
      assert.that(summary.byLayer.metaprogramming).isEqualTo(0);
      assert.that(summary.byLayer['fan-out']).isEqualTo(0);
    });

    test('counts violations by layer', async() => {
      const violations = [
        { layer: 'zero-dependency', file: 'lib/a.js', line: 1, message: 'msg' },
        { layer: 'metaprogramming', file: 'lib/b.js', line: 2, message: 'msg' },
        { layer: 'zero-dependency', file: 'lib/c.js', line: 3, message: 'msg' },
      ];
      const summary = buildSummary(violations);
      assert.that(summary.total).isEqualTo(3);
      assert.that(summary.byLayer['zero-dependency']).isEqualTo(2);
      assert.that(summary.byLayer.metaprogramming).isEqualTo(1);
      assert.that(summary.byLayer['fan-out']).isEqualTo(0);
    });
  });

  suite('formatTextOutput', () => {
    test('returns success message when there are no violations', async() => {
      const output = formatTextOutput([]);
      assert.isTrue(output.includes('all checks passed'));
    });

    test('formats each violation as a line with file, layer and message', async() => {
      const violations = [
        { layer: 'zero-dependency', file: 'lib/a.js', line: 5, message: "External import 'chalk'" },
      ];
      const output = formatTextOutput(violations);
      assert.isTrue(output.includes('lib/a.js:5'));
      assert.isTrue(output.includes('[zero-dependency]'));
      assert.isTrue(output.includes("External import 'chalk'"));
    });
  });

});
