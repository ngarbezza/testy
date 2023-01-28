'use strict';

const { suite, test, assert } = require('../../lib/testy');
const { I18n, I18nMessage } = require('../../lib/i18n/i18n');

suite('i18n messages', () => {
  const translations = { en: { key1: 'value 1', key2: 'value 2', key3: 'value 3' } };
  const locale = I18n.default(translations);

  test('empty messages return an empty string', () => {
    const message = I18nMessage.empty();

    assert.isEmpty(message.expressedIn(locale));
    assert.isFalse(message.hasContent());
  });

  test('joined messages fail on an empty collection of messages', () => {
    assert
      .that(() => I18nMessage.joined([], ', '))
      .raises(/No messages with content have been found to be composed/);
  });

  test('joined messages fail on a collection containing just empty messages', () => {
    const emptyMessageOne = I18nMessage.empty();
    const emptyMessageTwo = I18nMessage.empty();

    assert
      .that(() => I18nMessage.joined([emptyMessageOne, emptyMessageTwo], ', '))
      .raises(/No messages with content have been found to be composed/);
  });

  test('a joined message with a single message is equivalent to the single message', () => {
    const messageWithContent = I18nMessage.of('key1');
    const joinedMessage = I18nMessage.joined([messageWithContent], ', ');

    assert.isTrue(joinedMessage.hasContent());
    assert.areEqual(joinedMessage, messageWithContent);
    assert.areEqual(joinedMessage.expressedIn(locale), 'value 1');
  });

  test('a joined message with more than one single message joins the result with the given string', () => {
    const messageOne = I18nMessage.of('key1');
    const messageTwo = I18nMessage.of('key2');
    const messageThree = I18nMessage.of('key3');
    const joinedMessage = I18nMessage.joined([messageOne, messageTwo, messageThree], ', ');

    assert.isTrue(joinedMessage.hasContent());
    assert.areEqual(joinedMessage.expressedIn(locale), 'value 1, value 2, value 3');
  });

  test('I18nMessage is abstract and requires a protocol to be implemented', () => {
    const message = new I18nMessage();

    assert.that(() => message.hasContent()).raises(/subclass responsibility/);
    assert.that(() => message.expressedIn(locale)).raises(/subclass responsibility/);
  });
});
