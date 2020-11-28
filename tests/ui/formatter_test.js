'use strict';

const { suite, test, before, assert } = require('../../testy');
const Formatter = require('../../lib/formatter');
const I18n = require('../../lib/i18n');

suite('formatter', () => {
  let formatter, dummyConsole, i18n;
  
  before(() => {
    dummyConsole = {
      _messages: [],
      
      log(message) {
        this._messages.push(message);
      },
      
      messages() {
        return Array.from(this._messages);
      },
    };
  
    i18n = new I18n();
    formatter = new Formatter(dummyConsole, i18n);
  });
  
  test('display errors in red', () => {
    formatter.displayError('things happened');
    const expectedErrorMessage = '\x1b[31mthings happened\x1b[0m';
    assert.that(dummyConsole.messages()).includesExactly(expectedErrorMessage);
  });
});
