'use strict';

const { suite, test, before, assert, fail } = require('../testy');

suite('testing testy - basic features', () => {
  let circular = {}; circular.yourself = circular;
  
  before(() => { return { myVar: 7 }; });
  
  test('tests with body', () => {
    let pepe = { nombre: 'pepe' };
    assert.that(pepe.nombre).isEqualTo('pepe');
  });
  
  test("I'm a WIP");
  
  test('before hook can be used', (c) => assert.areEqual(c.myVar, 7));
  
  test('many assertions', () => {
    assert.areEqual(2, 1 + 1);
    assert.isTrue(true || false);
  });
  
  // commented so CI can pass - uncomment to see the failure
  // test("unexpected errors don't break the suite", () => assert.isTrue(notAFunction()));
  
  test("successful test after the failure", () => assert.isTrue(true));
  
  test("custom equality check", () => {
    let criteria = (o1, o2) => o1.a === o2.a;
    assert.areEqual({ a: 'a', b: 'b1'}, { a: 'a', b: 'b2'}, criteria);
    assert.that({ a: 'a', b: 'b1'}).isEqualTo({ a: 'a', b: 'b2'}, criteria);
    assert.that({ a: 'a', b: 'b1'}).isNotEqualTo({ a: 'a2', b: 'b1'}, criteria);
  });
  
  // commented so CI can pass - uncomment to see the failure
  // test("failing on purpose", () => fail("I just want to fail"));
  
  // commented so CI can pass - uncomment to see the failure
  // test("failing on purpose with no message", () => fail());
  
  // commented so CI can pass - uncomment to see the failure
  // test("failing if there are no assertions in the test body", () => 'no assert');
  
  // commented so CI can pass - uncomment to see the failure
  // test('equality check with objects having circular dependencies fails', () => assert.areEqual(circular, circular));
});
