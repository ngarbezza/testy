import { assert, suite, test } from '../../lib/testy.js';
import {
  isBoolean,
  isRegex,
  isStringWithContent,
  isUndefined,
  notNullOrUndefined,
  respondsTo,
} from '../../lib/utils/types.js';

suite('type utilities', () => {
  test('isRegex returns true for regexes', () => {
    assert.isTrue(isRegex(/something/));
  });

  test('isRegex returns false for other objects', () => {
    assert.isFalse(isRegex({}));
    assert.isFalse(isRegex('hey'));
    assert.isFalse(isRegex(() => {}));
  });

  test('respondsTo() is false when the property does not exist in the object', () => {
    assert.isFalse(respondsTo({}, 'dance'));
  });

  test('respondsTo() is true when the property exists as a function in the object', () => {
    const thingThatKnowsHowToDance = { dance() {
      return 'I am dancing!';
    } };
    assert.isTrue(respondsTo(thingThatKnowsHowToDance, 'dance'));
  });

  test('respondsTo() is false when the property exists in the object but it is not a function', () => {
    const thingThatHasADanceProperty = { dance: true };
    assert.isFalse(respondsTo(thingThatHasADanceProperty, 'dance'));
  });

  test('respondsTo() is false object is null or undefined', () => {
    assert.isFalse(respondsTo(null, 'dance'));
    assert.isFalse(respondsTo(undefined, 'dance'));
  });

  test('respondsTo() is true when the property exists as function at class-level, not instance-level', () => {
    class Dancer {
      dance() {
        return 'I am dancing!';
      }
    }
    const aDancer = new Dancer();
    assert.isTrue(respondsTo(aDancer, 'dance'));
  });

  test('respondsTo() works for non-object types', () => {
    assert.isTrue(respondsTo('hey', 'toString'));
  });

  test('notNullOrUndefined() is false on null and undefined', () => {
    assert.isFalse(notNullOrUndefined(null));
    assert.isFalse(notNullOrUndefined(undefined));
  });

  test('notNullOrUndefined() is true on objects and primitives', () => {
    assert.isTrue(notNullOrUndefined(5));
    assert.isTrue(notNullOrUndefined({ an: 'object' }));
  });

  test('isUndefined() is true on undefined', () => {
    assert.isTrue(isUndefined(undefined));
  });

  test('isUndefined() is false on null, objects and primitives', () => {
    assert.isFalse(isUndefined(null));
    assert.isFalse(isUndefined(0));
    assert.isFalse(isUndefined(''));
    assert.isFalse(isUndefined([]));
  });

  test('isStringWithContent() is true for a string containing one or more characters', () => {
    assert.isTrue(isStringWithContent('a'));
    assert.isTrue(isStringWithContent('an'));
    assert.isTrue(isStringWithContent('an object'));
  });

  test('isStringWithContent() is false for an empty string or string containing only separators', () => {
    assert.isFalse(isStringWithContent(''));
    assert.isFalse(isStringWithContent(' '));
    assert.isFalse(isStringWithContent('   '));
  });

  test('isBoolean() returns true on true and false booleans', () => {
    assert.isTrue(isBoolean(true));
    assert.isTrue(isBoolean(false));
  });

  test('isBoolean() returns false on non boolean types', () => {
    assert.isFalse(isBoolean(3));
    assert.isFalse(isBoolean(undefined));
    assert.isFalse(isBoolean('I AM AN INVALID VALUE'));
  });
});
