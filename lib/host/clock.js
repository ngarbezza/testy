/**
 * I am the host clock: the source of the current time. Isolating time behind a message
 * send lets tests inject a deterministic clock (the test-double exception of decision
 * 0005, since the clock is an external system we cannot control). See decision 0017.
 */
export class SystemClock {
  now() {
    return Date.now();
  }
}
