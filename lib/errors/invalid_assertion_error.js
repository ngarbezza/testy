'use strict';

export class InvalidAssertionError extends Error {
  constructor(reason) {
    super(reason.toString());
    this._reason = reason;
  }

  reason() {
    return this._reason;
  }
}
