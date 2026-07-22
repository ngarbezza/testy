import { assert, suite, test } from '../../lib/testy.js';
import { SystemClock } from '../../lib/host/clock.js';

suite('system clock', () => {
  test('answers a numeric instant in milliseconds', () => {
    const instant = new SystemClock().now();
    assert.that(typeof instant).isEqualTo('number');
  });

  test('never moves backwards between two reads', () => {
    const clock = new SystemClock();
    const first = clock.now();
    const second = clock.now();
    assert.that(second).isGreaterThanOrEqualTo(first);
  });
});
