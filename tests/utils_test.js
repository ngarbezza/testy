'use strict';

const { suite, test, assert } = require('../testy');
const Utils = require('../lib/utils');

suite('utility functions', () => {
  test('isCyclic is true if the object has a cyclic reference', () => {
    const obj = { a: 2 };
    obj.yourself = obj;
    assert.isTrue(Utils.isCyclic(obj));
  });
  
  test('isCyclic is false if the object does not have a cyclic reference', () => {
    const obj = { a: 2 };
    assert.isFalse(Utils.isCyclic(obj));
  });
  
  test('hasMethodDefined is true if the object has a function property with that name', () => {
    const object = { func: () => 42 };
    const method = 'func';
    assert.isTrue(Utils.hasMethodDefined(object, method));
  });
  
  test('hasMethodDefined is true if the object has a function property in any parent with that name', () => {
    const parent = { func: () => 42 };
    const object = { __proto__: parent };
    const method = 'func';
    assert.isTrue(Utils.hasMethodDefined(object, method));
  });
  
  test('hasMethodDefined is false if the object does not have a property with that name', () => {
    const object = {};
    const method = 'func';
    assert.isFalse(Utils.hasMethodDefined(object, method));
  });
  
  test('hasMethodDefined is false if the object has a property with that name, but it is not a function', () => {
    const object = { func: 'i am not a function' };
    const method = 'func';
    assert.isFalse(Utils.hasMethodDefined(object, method));
  });
  
  test('number of elements of Set', () => {
    assert.areEqual(Utils.numberOfElements(new Set([1,2])), 2);
  });
  
  test('number of elements of Array', () => {
    assert.areEqual(Utils.numberOfElements([1,2, 3]), 3);
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
    const thingThatKnowsHowToDance = { dance() { return 'I am dancing!' } };
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
});
