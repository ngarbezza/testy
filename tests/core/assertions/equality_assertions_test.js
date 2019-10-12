'use strict';

const { suite, test } = require('../../../testy');
const { asserter, expectSuccess, expectFailDueTo } = require('../../support/assertion_helpers');

suite('equality assertions', () => {
  test('isEqualTo pass with equal primitive objects', () => {
    asserter.that(42).isEqualTo(42);
    
    expectSuccess();
  });
  
  test('isEqualTo fails with different primitive objects', () => {
    asserter.that(42).isEqualTo(21);
    
    expectFailDueTo('Expected 42 to be equal to 21');
  });
  
  test('isEqualTo passes with boxed and unboxed numbers', () => {
    asserter.that(42).isEqualTo((42));
    
    expectSuccess();
  });
  
  test('isEqualTo passes with arrays in the same order', () => {
    asserter.that([1, 2, 3]).isEqualTo([1, 2, 3]);
    
    expectSuccess();
  });
  
  test('isEqualTo fails with arrays in different order', () => {
    asserter.that([1, 2, 3]).isEqualTo([1, 3, 2]);
    
    expectFailDueTo('Expected [ 1, 2, 3 ] to be equal to [ 1, 3, 2 ]');
  });
  
  test('isEqualTo passes with objects having the same property values', () => {
    let objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    let objectTwo = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    asserter.that(objectOne).isEqualTo(objectTwo);
    
    expectSuccess();
  });
  
  test('isEqualTo fails with objects having different property values', () => {
    let objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    let objectTwo = { a: 'a', b: { b1: 'b1', b2: '' } };
    asserter.that(objectOne).isEqualTo(objectTwo);
    
    expectFailDueTo("Expected { a: 'a', b: { b1: 'b1', b2: 'b2' } } to be equal to { a: 'a', b: { b1: 'b1', b2: '' } }");
  });
  
  test('isEqualTo fails if one object has less properties than the other', () => {
    let objectOne = { a: 'a', b: 'b' };
    let objectTwo = { a: 'a', b: 'b', c: 'c' };
    asserter.that(objectOne).isEqualTo(objectTwo);
    
    expectFailDueTo("Expected { a: 'a', b: 'b' } to be equal to { a: 'a', b: 'b', c: 'c' }");
  });
  
  test('isEqualTo fails if one object has more properties than the other', () => {
    let objectOne = { a: 'a', b: 'b', c: 'c' };
    let objectTwo = { a: 'a', b: 'b' };
    asserter.that(objectOne).isEqualTo(objectTwo);
    
    expectFailDueTo("Expected { a: 'a', b: 'b', c: 'c' } to be equal to { a: 'a', b: 'b' }");
  });
  
  test('isEqualTo with custom criteria fails if objects do not have that property', () => {
    let objectOne = { a: 'a', b: 'b' };
    let objectTwo = { a: 'a', b: 'b' };
    asserter.areEqual(objectOne, objectTwo, 'notFound');
    
    expectFailDueTo('Expected { a: \'a\', b: \'b\' } to be equal to { a: \'a\', b: \'b\' } Equality check failed. Objects do not have \'notFound\' property');
  });
  
  test('isEqualTo with custom criteria passes if the criteria evaluates to true', () => {
    let objectOne = { a: 'a', b: 'b1', myEqualMessage: () => true };
    let objectTwo = { a: 'a', b: 'b2', myEqualMessage: () => true };
    asserter.areEqual(objectOne, objectTwo, 'myEqualMessage');
    
    expectSuccess();
  });
  
  test('isEqualTo with custom criteria passes if the criteria evaluates to true, and we are comparing instances of the same class', () => {
    class AClass {
      constructor(a) { this.a = a }
      myEqualMessage() { return true }
    }
    let objectOne = new AClass();
    let objectTwo = new AClass();
    asserter.areEqual(objectOne, objectTwo, 'myEqualMessage');
    
    expectSuccess();
  });
  
  test('isEqualTo with equals() default criteria passes if it evaluates to true, and we are comparing instances of the same class', () => {
    class AClass {
      constructor(a) { this.a = a }
      equals() { return true }
    }
    let objectOne = new AClass(1);
    let objectTwo = new AClass(2);
    asserter.areEqual(objectOne, objectTwo);
    
    expectSuccess();
  });
});
