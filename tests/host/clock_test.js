import { assert, suite, test } from '../../lib/testy.js';
import { SystemClock } from '../../lib/host/clock.js';
import { FakeClock } from '../support/fake_clock.js';

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

suite('fake clock', () => {
  test('answers programmed instants in order', () => {
    const clock = FakeClock.startingAt(10, 25);
    assert.that(clock.now()).isEqualTo(10);
    assert.that(clock.now()).isEqualTo(25);
  });

  test('repeats the last instant once exhausted', () => {
    const clock = FakeClock.startingAt(5);
    assert.that(clock.now()).isEqualTo(5);
    assert.that(clock.now()).isEqualTo(5);
  });
});
