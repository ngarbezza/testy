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

  time(timerName) {
    this.log(`timer "${timerName}" started`);
  }

  timeEnd(timerName) {
    this.log(`timer "${timerName}" ended`);
  }
}
