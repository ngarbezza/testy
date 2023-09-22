'use strict';

import { assert, suite, test } from '../../lib/testy.js';

import { I18n } from '../../lib/i18n/i18n.js';
import { I18nMessage } from '../../lib/i18n/i18n_messages.js';

suite('i18n messages', () => {
  const translations = { en: { key1: 'value 1', key2: 'value 2', key3: 'value 3' } };
  const locale = I18n.default(translations);
  const anEmptyMessage = () => I18nMessage.empty();
  const aSingleMessageWithKey = key => I18nMessage.of(key);
  const aJoinedMessageOf = (...messages) => I18nMessage.joined(messages, ',');

  test('empty messages return an empty string and have no associated keys', () => {
    const emptyMessage = anEmptyMessage();

    assert.isEmpty(emptyMessage.expressedIn(locale));
    assert.isFalse(emptyMessage.hasContent());
    assert.isEmpty(emptyMessage.associatedKeys());
  });

  test('joined messages fail on an empty collection of messages', () => {
    assert
      .that(() => I18nMessage.joined([], ', '))
      .raises(/No messages with content have been found to be composed/);
  });

  test('joined messages fail on a collection containing just empty messages', () => {
    const emptyMessageOne = anEmptyMessage();
    const emptyMessageTwo = anEmptyMessage();

    assert
      .that(() => I18nMessage.joined([emptyMessageOne, emptyMessageTwo], ', '))
      .raises(/No messages with content have been found to be composed/);
  });

  test('a joined message with a single message is equivalent to the single message', () => {
    const messageWithContent = aSingleMessageWithKey('key1');
    const joinedMessage = I18nMessage.joined([messageWithContent], ', ');

    assert.isTrue(joinedMessage.hasContent());
    assert.areEqual(joinedMessage, messageWithContent);
    assert.areEqual(joinedMessage.expressedIn(locale), 'value 1');
  });

  test('a joined message with more than one single message joins the result with the given string', () => {
    const messageOne = aSingleMessageWithKey('key1');
    const messageTwo = aSingleMessageWithKey('key2');
    const messageThree = aSingleMessageWithKey('key3');
    const joinedMessage = I18nMessage.joined([messageOne, messageTwo, messageThree], ', ');

    assert.isTrue(joinedMessage.hasContent());
    assert.areEqual(joinedMessage.expressedIn(locale), 'value 1, value 2, value 3');
  });

  test('I18nMessage is abstract and requires a protocol to be implemented', () => {
    const message = new I18nMessage();

    assert.that(() => message.hasContent()).raises(/subclass responsibility/);
    assert.that(() => message.expressedIn(locale)).raises(/subclass responsibility/);
    assert.that(() => message.associatedKeys()).raises(/subclass responsibility/);
  });

  test('a standard message has a single associated key', () => {
    const message = aSingleMessageWithKey('key2');

    assert.that(message.associatedKeys()).includesExactly('key2');
  });

  test('a joined groups all the single messages keys', () => {
    const message = aJoinedMessageOf(
      aSingleMessageWithKey('key1'),
      aJoinedMessageOf(
        aSingleMessageWithKey('key2'),
        aSingleMessageWithKey('key3')));

    assert.that(message.associatedKeys()).includesExactly('key1', 'key2', 'key3');
  });
});
