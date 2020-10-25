'use strict';

const { suite, test, before, after, assert } = require('../../testy');

suite('testing testy - basic features', () => {
  const circular = {}; circular.yourself = circular;
  let myVar = 8;
  
  before(() => myVar = 7);
  after(() => myVar = undefined);
  
  test('tests with body', () => {
    const pepe = { nombre: 'pepe' };
    assert.that(pepe.nombre).isEqualTo('pepe');
  });
  
  test('before hook can be used', () => assert.areEqual(myVar, 7));
  
  test('many assertions', () => {
    assert.areEqual(2, 1 + 1);
    assert.isTrue(true || false);
  });
  
  // commented so CI can pass - uncomment to see the failure
  // test("unexpected errors don't break the suite", () => assert.isTrue(notAFunction()));
  
  test('successful test after the failure', () => assert.isTrue(true));
  
  test('custom equality check', () => {
    const criteria = (o1, o2) => o1.a === o2.a;
    assert.areEqual({ a: 'a', b: 'b1' }, { a: 'a', b: 'b2' }, criteria);
    assert.that({ a: 'a', b: 'b1' }).isEqualTo({ a: 'a', b: 'b2' }, criteria);
    assert.that({ a: 'a', b: 'b1' }).isNotEqualTo({ a: 'a2', b: 'b1' }, criteria);
  });
  
  test('equality check when objects understand equals()', () => {
    const objectOne = { a: 'a', b: 'b1', equals: function(another) {
      return this.a === another.a; 
    } };
    const objectTwo = { a: 'a', b: 'b2', equals: function(another) {
      return this.b === another.b; 
    } };
    assert.that(objectOne).isEqualTo(objectTwo);
    assert.that(objectTwo).isNotEqualTo(objectOne);
  });
  
  test('equality check using custom message name', () => {
    const objectOne = { a: 'a', b: 'b1', sameAs: function(another) {
      return this.a === another.a; 
    } };
    const objectTwo = { a: 'a', b: 'b2', sameAs: function(another) {
      return this.b === another.b; 
    } };
    assert.that(objectOne).isEqualTo(objectTwo, 'sameAs');
    assert.that(objectTwo).isNotEqualTo(objectOne, 'sameAs');
  });
  
  // commented so CI can pass - uncomment to see the failure
  // test('fails in the first error', () => {
  //   assert.isTrue(false);
  //   assert.isTrue(true);
  // });
  
  // commented so CI can pass - uncomment to see the failure
  // test("failing on purpose", () => fail.with("I just want to fail"));
  
  // commented so CI can pass - uncomment to see the failure
  // test("failing if there are no assertions in the test body", () => 'no assert');
  
  // commented so CI can pass - uncomment to see the failure
  // test('equality check with objects having circular references fails', () => assert.areEqual(circular, circular));
});
