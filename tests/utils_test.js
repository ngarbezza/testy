'use strict';

const { suite, test, assert } = require('../testy');
const Utils = require('../lib/utils');
const { sourceCodeLocationRegex } = require('./support/assertion_helpers');

suite('utility functions', () => {
  test('isCyclic is true if the object has a cyclic reference', () => {
    const obj = { asd: 2 };
    obj.yourself = obj;
    assert.isTrue(Utils.isCyclic(obj));
  });

  test('isCyclic is false if the object does not have a cyclic reference', () => {
    const obj = { asd: 2 };
    assert.isFalse(Utils.isCyclic(obj));
  });

  test('isCyclic is false if the object is null, string or other non-object type', () => {
    assert.isFalse(Utils.isCyclic(null));
    assert.isFalse(Utils.isCyclic('just a string'));
    assert.isFalse(Utils.isCyclic(42));
  });

  test('isCyclic does not fail if the object contains properties with null values', () => {
    assert.isFalse(Utils.isCyclic({ thisValueIs: null }));
  });

  test('number of elements of Set', () => {
    assert.areEqual(Utils.numberOfElements(new Set([1, 2])), 2);
  });

  test('number of elements of Array', () => {
    assert.areEqual(Utils.numberOfElements([1, 2, 3]), 3);
  });

  test('isRegex returns true for regexes', () => {
    assert.isTrue(Utils.isRegex(/something/));
    assert.isTrue(Utils.isRegex(new RegExp('something')));
  });

  test('isRegex returns false for other objects', () => {
    assert.isFalse(Utils.isRegex({}));
    assert.isFalse(Utils.isRegex('hey'));
    assert.isFalse(Utils.isRegex(() => {}));
  });

  test('respondsTo() is false when the property does not exist in the object', () => {
    assert.isFalse(Utils.respondsTo({}, 'dance'));
  });

  test('respondsTo() is true when the property exists as a function in the object', () => {
    const thingThatKnowsHowToDance = { dance() {
      return 'I am dancing!';
    } };
    assert.isTrue(Utils.respondsTo(thingThatKnowsHowToDance, 'dance'));
  });

  test('respondsTo() is false when the property exists in the object but it is not a function', () => {
    const thingThatHasADanceProperty = { dance: true };
    assert.isFalse(Utils.respondsTo(thingThatHasADanceProperty, 'dance'));
  });

  test('respondsTo() is false object is null or undefined', () => {
    assert.isFalse(Utils.respondsTo(null, 'dance'));
    assert.isFalse(Utils.respondsTo(undefined, 'dance'));
  });

  test('respondsTo() is true when the property exists as function at class-level, not instance-level', () => {
    class Dancer {
      dance() {
        return 'I am dancing!';
      }
    }
    const aDancer = new Dancer();
    assert.isTrue(Utils.respondsTo(aDancer, 'dance'));
  });

  test('respondsTo() works for non-object types', () => {
    assert.isTrue(Utils.respondsTo('hey', 'toString'));
  });

  test('prettyPrint() uses toString() when available', () => {
    const printable = { toString: () => 'I know how to print myself' };
    assert.that(Utils.prettyPrint(printable)).isEqualTo('I know how to print myself');
  });

  test('prettyPrint() does not use toString() of arrays, and uses inspect instead', () => {
    assert.that(Utils.prettyPrint([1, 2, 3])).isEqualTo('[ 1, 2, 3 ]');
  });

  test('prettyPrint() does not use toString() of strings, and uses inspect instead', () => {
    assert.that(Utils.prettyPrint('hello')).isEqualTo('\'hello\'');
  });

  test('prettyPrint() display objects in a compact style with infinite depth', () => {
    const obj = { p1: { p2: { p3: { p4: { p5: true } } } } };
    assert.that(Utils.prettyPrint(obj)).isEqualTo('{ p1: { p2: { p3: { p4: { p5: true } } } } }');
  });

  test('notNullOrUndefined() is false on null and undefined', () => {
    assert.isFalse(Utils.notNullOrUndefined(null));
    assert.isFalse(Utils.notNullOrUndefined(undefined));
  });

  test('notNullOrUndefined() is true on objects and primitives', () => {
    assert.isTrue(Utils.notNullOrUndefined(5));
    assert.isTrue(Utils.notNullOrUndefined({ an: 'object' }));
  });

  test('isUndefined() is true on undefined', () => {
    assert.isTrue(Utils.isUndefined(undefined));
  });

  test('isUndefined() is false on null, objects and primitives', () => {
    assert.isFalse(Utils.isUndefined(null));
    assert.isFalse(Utils.isUndefined(0));
    assert.isFalse(Utils.isUndefined(''));
    assert.isFalse(Utils.isUndefined([]));
  });

  test('isStringWithContent() is true for a string containing one or more characters', () => {
    assert.isTrue(Utils.isStringWithContent('a'));
    assert.isTrue(Utils.isStringWithContent('an'));
    assert.isTrue(Utils.isStringWithContent('an object'));
  });

  test('isStringWithContent() is false for an empty string or string containing only separators', () => {
    assert.isFalse(Utils.isStringWithContent(''));
    assert.isFalse(Utils.isStringWithContent(' '));
    assert.isFalse(Utils.isStringWithContent('   '));
  });

  test('errorDetailOf() returns stack trace if the thrown object is an error', () => {
    const thrownObject = new Error('oops I did it again');
    assert.areEqual(Utils.errorDetailOf(thrownObject), thrownObject.stack);
  });

  test('errorDetailOf() returns the string contents if the thrown object is a string', () => {
    const thrownObject = 'oops I did it again';
    assert.areEqual(Utils.errorDetailOf(thrownObject), 'oops I did it again');
  });

  test('errorDetailOf() returns the string representation if the thrown object is not a string', () => {
    const thrownObject = [1, 2, 3];
    assert.areEqual(Utils.errorDetailOf(thrownObject), '1,2,3');
  });

  test('isEmpty() returns true on empty string and array', () => {
    assert.isTrue(Utils.isEmpty(''));
    assert.isTrue(Utils.isEmpty([]));
  });

  test('isEmpty() returns false on strings and arrays with content', () => {
    assert.isFalse(Utils.isEmpty('   something   '));
    assert.isFalse(Utils.isEmpty(['some', 'thing']));
  });

  test('detectUserCallingLocation() reports a valid location', () => {
    assert.that(Utils.detectUserCallingLocation()).matches(sourceCodeLocationRegex);
  });
});
