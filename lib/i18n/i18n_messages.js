import { deepStrictEqual, prettyPrint, subclassResponsibility } from '../utils.js';

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

  toJson() {
    subclassResponsibility();
  }

  equals(anotherMessage) {
    return deepStrictEqual(this.toJson(), anotherMessage.toJson());
  }

  toString() {
    return prettyPrint(this.toJson());
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

  toJson() {
    return {};
  }
}

class ComposedI18nMessage extends I18nMessage {
  #messages;
  #joinString;

  constructor(messages, joinString) {
    super();
    this.#messages = messages;
    this.#joinString = joinString;
    Object.freeze(this);
  }

  expressedIn(locale) {
    return this.#messages
      .map(message => message.expressedIn(locale))
      .join(this.#joinString);
  }

  hasContent() {
    return true;
  }

  associatedKeys() {
    return this.#messages.flatMap(subMessage => subMessage.associatedKeys());
  }

  toJson() {
    return { messages: this.#messages.map(message => message.toJson()) };
  }
}

class SingleI18nMessage extends I18nMessage {
  #key;
  #params;

  constructor(key, ...params) {
    super();
    this.#key = key;
    this.#params = params;
    Object.freeze(this);
  }

  expressedIn(locale) {
    return locale.translate(this.#key, ...this.#params);
  }

  hasContent() {
    return true;
  }

  associatedKeys() {
    return [this.#key];
  }

  toJson() {
    return { key: this.#key, params: this.#params };
  }
}

export { I18nMessage };
