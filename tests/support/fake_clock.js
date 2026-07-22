/**
 * A deterministic clock for tests. It answers the pre-programmed instants in order and
 * repeats the last one once exhausted, so duration assertions become exact. It honours
 * the same protocol as SystemClock (now()).
 */
export class FakeClock {
  #instants;
  #index;

  static startingAt(...instants) {
    return new this(instants);
  }

  constructor(instants) {
    this.#instants = instants.length > 0 ? instants : [0];
    this.#index = 0;
  }

  now() {
    const instant = this.#instants[this.#index];
    if (this.#index < this.#instants.length - 1) {
      this.#index += 1;
    }
    return instant;
  }
}
