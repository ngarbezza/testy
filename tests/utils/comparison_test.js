import { assert, suite, test } from '../../lib/testy.js';
import { isCyclic } from '../../lib/utils/comparison.js';

suite('comparison utilities', () => {
  test('isCyclic is true if the object has a cyclic reference', () => {
    const obj = { asd: 2 };
    obj.yourself = obj;
    assert.isTrue(isCyclic(obj));
  });

  test('isCyclic is false if the object does not have a cyclic reference', () => {
    const obj = { asd: 2 };
    assert.isFalse(isCyclic(obj));
  });

  test('isCyclic is false if the object is null, string or other non-object type', () => {
    assert.isFalse(isCyclic(null));
    assert.isFalse(isCyclic('just a string'));
    assert.isFalse(isCyclic(42));
  });

  test('isCyclic does not fail if the object contains properties with null values', () => {
    assert.isFalse(isCyclic({ thisValueIs: null }));
  });
});
