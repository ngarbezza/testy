'use strict';

class FakeConsole {
  constructor() {
    this._messages = [];
  }

  log(message) {
    this._messages.push(message);
  }

  messages() {
    return Array.from(this._messages);
  }
}

module.exports = FakeConsole;
