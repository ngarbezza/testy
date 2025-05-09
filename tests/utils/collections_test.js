import { assert, suite, test } from '../../lib/testy.js';
import { isEmpty, numberOfElements } from '../../lib/utils/collections.js';

suite('collection utilities', () => {
  test('number of elements of Set', () => {
    assert.areEqual(numberOfElements(new Set([1, 2])), 2);
  });

  test('number of elements of Array', () => {
    assert.areEqual(numberOfElements([1, 2, 3]), 3);
  });

  test('isEmpty() returns true on empty string and array', () => {
    assert.isTrue(isEmpty(''));
    assert.isTrue(isEmpty([]));
  });

  test('isEmpty() returns false on strings and arrays with content', () => {
    assert.isFalse(isEmpty('   something   '));
    assert.isFalse(isEmpty(['some', 'thing']));
  });
});
