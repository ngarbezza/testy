import { assert, suite, test } from '../../lib/testy.js';
import { prettyPrint } from '../../lib/utils/formatting.js';

suite('formatting utilities', () => {
  test('prettyPrint() uses toString() when available', () => {
    const printable = { toString: () => 'I know how to print myself' };
    assert.that(prettyPrint(printable)).isEqualTo('I know how to print myself');
  });

  test('prettyPrint() does not use toString() of arrays, and uses inspect instead', () => {
    assert.that(prettyPrint([1, 2, 3])).isEqualTo('[ 1, 2, 3 ]');
  });

  test('prettyPrint() does not use toString() of strings, and uses inspect instead', () => {
    assert.that(prettyPrint('hello')).isEqualTo('\'hello\'');
  });

  test('prettyPrint() display objects in a compact style with infinite depth', () => {
    const obj = { p1: { p2: { p3: { p4: { p5: true } } } } };
    assert.that(prettyPrint(obj)).isEqualTo('{ p1: { p2: { p3: { p4: { p5: true } } } } }');
  });
});
