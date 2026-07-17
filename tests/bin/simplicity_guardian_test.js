import { assert, suite, test } from '../../lib/testy.js';
import {
  detectExternalImports,
  detectMetaprogramming,
  detectHighFanOut,
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

});
