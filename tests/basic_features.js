'use strict';

const { suite, test, before, assertTrue, assertThat, assertEquals, isEqualTo, fail } = require('../testy');

suite('testing testy - basic features', () => {
  before(() => { return { myVar: 7 }; });
  
  test("tests with body", () => {
    let pepe = { nombre: "pepe" };
    assertThat(pepe.nombre, isEqualTo("pepe"));
  });
  
  test("I'm a WIP");
  
  test("before hook can be used", (c) => assertEquals(c.myVar, 7));
  
  test("many assertions", () => {
    assertEquals(2, 1 + 1);
    assertTrue(true || false);
  });
  
  // commented so CI can pass - uncomment to see the failure
  // test("unexpected errors don't break the suite", () => assertTrue(notAFunction()));
  
  test("successful test after the failure", () => assertTrue(true));
  
  test("custom equality check", () => {
    let criteria = (o1, o2) => o1.a === o2.a;
    assertEquals({ a: 'a', b: 'b1'}, { a: 'a', b: 'b2'}, criteria);
  });
  
  // commented so CI can pass - uncomment to see the failure
  // test("failing on purpose", () => fail("I just want to fail"));
  
  // commented so CI can pass - uncomment to see the failure
  // test("failing on purpose with no message", () => fail());
  
  // commented so CI can pass - uncomment to see the failure
  // test("failing if there are no assertions in the test body", () => { return 'no assert'; });
});
