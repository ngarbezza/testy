'use strict';

export class FakeConsole {
  constructor() {
    this._messages = [];
  }

  log(message) {
    this._messages.push(message);
  }

  messages() {
    return Array.from(this._messages);
  }

  time() {
    this.log('timer started');
  }

  timeEnd() {
    this.log('timer ended');
  }
}
