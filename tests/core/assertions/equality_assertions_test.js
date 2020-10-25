'use strict';

const { suite, test } = require('../../../testy');
const { asserter, expectSuccess, expectFailureDueTo } = require('../../support/assertion_helpers');

suite('equality assertions', () => {
  test('isEqualTo pass with equal primitive objects', () => {
    asserter.that(42).isEqualTo(42);
    
    expectSuccess();
  });
  
  test('isEqualTo fails with different primitive objects', () => {
    asserter.that(42).isEqualTo(21);
    
    expectFailureDueTo('Expected 42 to be equal to 21');
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
    
    expectFailureDueTo('Expected [ 1, 2, 3 ] to be equal to [ 1, 3, 2 ]');
  });
  
  test('isEqualTo passes with objects having the same property values', () => {
    const objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    const objectTwo = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    asserter.that(objectOne).isEqualTo(objectTwo);
    
    expectSuccess();
  });
  
  test('isEqualTo fails with objects having different property values', () => {
    const objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    const objectTwo = { a: 'a', b: { b1: 'b1', b2: '' } };
    asserter.that(objectOne).isEqualTo(objectTwo);
    
    expectFailureDueTo("Expected { a: 'a', b: { b1: 'b1', b2: 'b2' } } to be equal to { a: 'a', b: { b1: 'b1', b2: '' } }");
  });
  
  test('isEqualTo fails if one object has less properties than the other', () => {
    const objectOne = { a: 'a', b: 'b' };
    const objectTwo = { a: 'a', b: 'b', c: 'c' };
    asserter.that(objectOne).isEqualTo(objectTwo);
    
    expectFailureDueTo("Expected { a: 'a', b: 'b' } to be equal to { a: 'a', b: 'b', c: 'c' }");
  });
  
  test('isEqualTo fails if one object has more properties than the other', () => {
    const objectOne = { a: 'a', b: 'b', c: 'c' };
    const objectTwo = { a: 'a', b: 'b' };
    asserter.that(objectOne).isEqualTo(objectTwo);
    
    expectFailureDueTo("Expected { a: 'a', b: 'b', c: 'c' } to be equal to { a: 'a', b: 'b' }");
  });
  
  test('isEqualTo with custom criteria fails if objects do not have that property', () => {
    const objectOne = { a: 'a', b: 'b' };
    const objectTwo = { a: 'a', b: 'b' };
    asserter.areEqual(objectOne, objectTwo, 'notFound');
    
    expectFailureDueTo('Expected { a: \'a\', b: \'b\' } to be equal to { a: \'a\', b: \'b\' } Equality check failed. Objects do not have \'notFound\' property');
  });
  
  test('isEqualTo with custom criteria passes if the criteria evaluates to true', () => {
    const objectOne = { a: 'a', b: 'b1', myEqualMessage: () => true };
    const objectTwo = { a: 'a', b: 'b2', myEqualMessage: () => true };
    asserter.areEqual(objectOne, objectTwo, 'myEqualMessage');
    
    expectSuccess();
  });
  
  test('isEqualTo with custom criteria passes if the criteria evaluates to true, and we are comparing instances of the same class', () => {
    class AClass {
      constructor(a) {
        this.a = a; 
      }
      myEqualMessage() {
        return true; 
      }
    }
    const objectOne = new AClass();
    const objectTwo = new AClass();
    asserter.areEqual(objectOne, objectTwo, 'myEqualMessage');
    
    expectSuccess();
  });
  
  test('isEqualTo with equals() default criteria passes if it evaluates to true, and we are comparing instances of the same class', () => {
    class AClass {
      constructor(a) {
        this.a = a; 
      }
      equals() {
        return true; 
      }
    }
    const objectOne = new AClass(1);
    const objectTwo = new AClass(2);
    asserter.areEqual(objectOne, objectTwo);
    
    expectSuccess();
  });
  
  test('isEqualTo fails when comparing undefined with an object', () => {
    asserter.areEqual(undefined, {});
    expectFailureDueTo('Expected undefined to be equal to {}');
    asserter.areEqual({}, undefined);
    expectFailureDueTo('Expected {} to be equal to undefined');
  });
  
  test('isEqualTo fails when comparing null with an object', () => {
    asserter.areEqual(null, {});
    expectFailureDueTo('Expected null to be equal to {}');
    asserter.areEqual({}, null);
    expectFailureDueTo('Expected {} to be equal to null');
  });
  
  test('isEqualTo fails if both parts are undefined', () => {
    asserter.areEqual(undefined, undefined);
    expectFailureDueTo('Equality cannot be determined. Both parts are undefined');
  });
});
