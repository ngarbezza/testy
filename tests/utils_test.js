'use strict';

import { assert, suite, test } from '../lib/testy.js';

import {
  detectUserCallingLocation,
  errorDetailOf,
  isCyclic, isEmpty,
  isRegex, isStringWithContent,
  isUndefined,
  notNullOrUndefined,
  numberOfElements,
  prettyPrint,
  respondsTo,
} from '../lib/utils.js';
import { sourceCodeLocationRegex } from './support/assertion_helpers.js';

suite('utility functions', () => {
  test('isCyclic is true if the object has a cyclic reference', () => {
    const obj = { asd: 2 };
    obj.yourself = obj;
    assert.isTrue(isCyclic(obj));
  });

  test('isCyclic is false if the object does not have a cyclic reference', () => {
    const obj = { asd: 2 };
    assert.isFalse(isCyclic(obj));
  });

  test('isCyclic is false if the object is null, string or other non-object type', () => {
    assert.isFalse(isCyclic(null));
    assert.isFalse(isCyclic('just a string'));
    assert.isFalse(isCyclic(42));
  });

  test('isCyclic does not fail if the object contains properties with null values', () => {
    assert.isFalse(isCyclic({ thisValueIs: null }));
  });

  test('number of elements of Set', () => {
    assert.areEqual(numberOfElements(new Set([1, 2])), 2);
  });

  test('number of elements of Array', () => {
    assert.areEqual(numberOfElements([1, 2, 3]), 3);
  });

  test('isRegex returns true for regexes', () => {
    assert.isTrue(isRegex(/something/));
    assert.isTrue(isRegex(new RegExp('something')));
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

  test('prettyPrint() uses toString() when available', () => {
    const printable = { toString: () => 'I know how to print myself' };
    assert.that(prettyPrint(printable)).isEqualTo('I know how to print myself');
  });

  test('prettyPrint() does not use toString() of arrays, and uses inspect instead', () => {
    assert.that(prettyPrint([1, 2, 3])).isEqualTo('[ 1, 2, 3 ]');
  });

  test('prettyPrint() does not use toString() of strings, and uses inspect instead', () => {
    assert.that(prettyPrint('hello')).isEqualTo('\'hello\'');
  });

  test('prettyPrint() display objects in a compact style with infinite depth', () => {
    const obj = { p1: { p2: { p3: { p4: { p5: true } } } } };
    assert.that(prettyPrint(obj)).isEqualTo('{ p1: { p2: { p3: { p4: { p5: true } } } } }');
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

  test('errorDetailOf() returns stack trace if the thrown object is an error', () => {
    const thrownObject = new Error('oops I did it again');
    assert.areEqual(errorDetailOf(thrownObject), thrownObject.stack);
  });

  test('errorDetailOf() returns the string contents if the thrown object is a string', () => {
    const thrownObject = 'oops I did it again';
    assert.areEqual(errorDetailOf(thrownObject), 'oops I did it again');
  });

  test('errorDetailOf() returns the string representation if the thrown object is not a string', () => {
    const thrownObject = [1, 2, 3];
    assert.areEqual(errorDetailOf(thrownObject), '1,2,3');
  });

  test('isEmpty() returns true on empty string and array', () => {
    assert.isTrue(isEmpty(''));
    assert.isTrue(isEmpty([]));
  });

  test('isEmpty() returns false on strings and arrays with content', () => {
    assert.isFalse(isEmpty('   something   '));
    assert.isFalse(isEmpty(['some', 'thing']));
  });

  test('detectUserCallingLocation() reports a valid location', () => {
    assert.that(detectUserCallingLocation()).matches(sourceCodeLocationRegex);
  });
});
