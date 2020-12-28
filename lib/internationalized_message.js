'use strict';

class InternationalizedMessage {
  constructor(key, ...params) {
    this._key = key;
    this._params = params;
  }
  
  expressedInLocale(locale) {
    return locale.translate(this._key, ...this._params);
  }
}

module.exports = InternationalizedMessage;
