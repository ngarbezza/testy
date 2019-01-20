'use strict';

const {
  suite, test,
  assertTrue, assertFalse, assertThat, assertEquals,
  isEqualTo, isNotEqualTo, raises, doesNotRaise, doesNotRaiseAnyErrors, includes
} = require('../testy');

let emptyFunction = () => { };

suite('testing testy - basic assertions', () => {
  test("there's assertTrue", () => assertTrue(1 === 1));
  
  test("there's assertFalse", () => assertFalse(1 === 0));
  
  test("object equality", () => assertThat(42, isEqualTo(40 + 2)));
  
  test("object is not equal", () => assertThat(42, isNotEqualTo(41)));
  
  test("object equality - different syntax", () =>
    assertEquals(42, 40 + 2)
  );
  
  test("inclusion in collection", () =>
    assertThat([1, 2, 3], includes(2))
  );
  
  test("assert error messages", () =>
    assertThat(() => { throw 'hey!'; }, raises("hey!"))
  );
  
  // commented so CI can pass - uncomment to see the failure
  // test("tests can fail as well :)", () =>
  //   assertThat(() => { throw 'hey!'; }, raises("ho!"))
  // );
  
  test('testing that no specific error happened', () =>
    assertThat(emptyFunction, doesNotRaise("hey!"))
  );
  
  test('testing that no specific error happened - even if other error occurs', () =>
    assertThat(() => { throw "ho!"; }, doesNotRaise("hey!"))
  );
  
  test('testing that no error happens at all', () =>
    assertThat(emptyFunction, doesNotRaiseAnyErrors())
  );
  
  test("object comparison", () =>
    assertEquals({ a: 2, b: [1, 2, 3] }, { a: 2, b: [1, 2, 3] })
  );
});
