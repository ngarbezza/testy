const { suite, test, before, assertTrue, assertFalse, assertThat, assertEquals, isEqualTo, raises, includes } = require('./testy');

suite('testing testy', () => {
  before(() => { return { myVar: 7 } });
  
  test("there's assertTrue", () => assertTrue(1 === 1));
  
  test("there's assertFalse", () => assertFalse(1 === 0));
  
  test("tests with body", () => {
    let pepe = { nombre: "pepe" };
    assertThat(pepe.nombre, isEqualTo("pepe"))
  });
  
  test("object equality", () =>
    assertThat(42, isEqualTo(40 + 2))
  );
  
  test("object equality - different syntax", () =>
    assertEquals(42, 40 + 2)
  );
  
  test("inclusion in collection", () =>
    assertThat([1, 2, 3], includes(2))
  );
  
  test("assert error messages", () =>
    assertThat(() => { throw 'hey!' }, raises("hey!"))
  );
  
  test("tests can fail as well :)", () =>
    assertThat(() => { throw 'hey!' }, raises("ho!"))
  );
  
  test("object comparison", () =>
    assertEquals({ a: 2, b: [1,2,3]}, { a: 2, b: [1,2,3]})
  );
  
  test("I'm a WIP");
  
  test("before hook can be used", (c) =>
    assertEquals(c.myVar, 7)
  );
  
  test("many assertions", () => {
    assertEquals(2, 1 + 1);
    assertTrue(true || false);
  });
  
  test("failures don't break the suite", () => {
    assertTrue(notAFunction())
  })
});