import { assert, suite, test } from '../../lib/testy.js';
import { subclassResponsibility } from '../../lib/utils/objects.js';

suite('object utilities', () => {
  test('subclassResponsibility() always raises an error with that message', () => {
    assert.that(() => subclassResponsibility()).raises(/subclass responsibility/);
  });
});
