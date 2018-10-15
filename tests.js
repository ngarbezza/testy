const { suite, test, assertTrue, assertFalse, assertThat, isEqualTo, raises, includes } = require('./testy');

suite('testing testy',
  test("there's assertTrue", assertTrue(1 === 1)),
  
  test("there's assertFalse", assertFalse(1 === 0)),
  
  test("tests with body", () => {
    let pepe = { nombre: "pepe" };
    return assertThat(pepe.nombre, isEqualTo("pepe"))
  }),
  
  test("object equality",
    assertThat(42, isEqualTo(40 + 2))
  ),
  
  test("inclusion in collection",
    assertThat([1, 2, 3], includes(2))
  ),
  
  test("assert error messages",
    assertThat(() => { throw 'hey!' }, raises("hey!"))
  ),
  
  test("tests can fail as well :)",
    assertThat(() => { throw 'hey!' }, raises("ho!"))
  ),
  
  test("I'm a WIP")
);