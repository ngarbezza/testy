'use strict';

import { subclassResponsibility } from '../utils.js';

class I18nMessage {
  static of(key, ...params) {
    return new SingleI18nMessage(key, ...params);
  }

  static empty() {
    return new EmptyMessage();
  }

  static joined(messages, joinedBy) {
    const messagesWithContent = messages.filter(message => message.hasContent());

    if (messagesWithContent.length === 0) {
      throw new Error('No messages with content have been found to be composed');
    } else if (messagesWithContent.length === 1) {
      return messagesWithContent.at(0);
    } else {
      return new ComposedI18nMessage(messagesWithContent, joinedBy);
    }
  }

  expressedIn(_locale) {
    subclassResponsibility();
  }

  hasContent() {
    subclassResponsibility();
  }

  associatedKeys() {
    subclassResponsibility();
  }
}

class EmptyMessage extends I18nMessage {
  expressedIn(_locale) {
    return '';
  }

  hasContent() {
    return false;
  }

  associatedKeys() {
    return [];
  }
}

class ComposedI18nMessage extends I18nMessage {
  constructor(messages, joinString) {
    super();
    this._messages = messages;
    this._joinString = joinString;
    Object.freeze(this);
  }

  expressedIn(locale) {
    return this._messages
      .map(message => message.expressedIn(locale))
      .join(this._joinString);
  }

  hasContent() {
    return true;
  }

  associatedKeys() {
    return this._messages.flatMap(subMessage => subMessage.associatedKeys());
  }
}

class SingleI18nMessage extends I18nMessage {
  constructor(key, ...params) {
    super();
    this._key = key;
    this._params = params;
    Object.freeze(this);
  }

  expressedIn(locale) {
    return locale.translate(this._key, ...this._params);
  }

  hasContent() {
    return true;
  }

  associatedKeys() {
    return [this._key];
  }
}

export { I18nMessage };
