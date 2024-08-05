export class InvalidAssertionError extends Error {
  #reason;

  constructor(reason) {
    super(reason.toString());
    this.#reason = reason;
  }

  reason() {
    return this.#reason;
  }
}
