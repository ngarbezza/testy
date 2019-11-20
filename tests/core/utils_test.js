'use strict';

const { suite, test, assert } = require('../../testy');
const Utils = require('../../lib/utils');

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
});
