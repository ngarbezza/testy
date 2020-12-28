'use strict';

const { suite, test } = require('../../../testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectSuccess, expectFailureOn } = require('../../support/assertion_helpers');

suite('equality assertions', () => {
  test('isEqualTo pass with equal primitive objects', () => {
    const result = resultOfATestWith(assert => assert.that(42).isEqualTo(42));
    
    expectSuccess(result);
  });
  
  test('isEqualTo fails with different primitive objects', () => {
    const result = resultOfATestWith(assert => assert.that(42).isEqualTo(21));
    
    expectFailureOn(result, 'Expected 42 to be equal to 21');
  });
  
  test('isEqualTo passes with boxed and unboxed numbers', () => {
    const result = resultOfATestWith(assert => assert.that(42).isEqualTo((42)));
    
    expectSuccess(result);
  });
  
  test('isEqualTo passes with arrays in the same order', () => {
    const result = resultOfATestWith(assert => assert.that([1, 2, 3]).isEqualTo([1, 2, 3]));
    
    expectSuccess(result);
  });
  
  test('isEqualTo fails with arrays in different order', () => {
    const result = resultOfATestWith(assert => assert.that([1, 2, 3]).isEqualTo([1, 3, 2]));
    
    expectFailureOn(result, 'Expected [ 1, 2, 3 ] to be equal to [ 1, 3, 2 ]');
  });
  
  test('isEqualTo passes with objects having the same property values', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    const objectTwo = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    /* eslint-enable id-length */
    const result = resultOfATestWith(assert => assert.that(objectOne).isEqualTo(objectTwo));
    
    expectSuccess(result);
  });
  
  test('isEqualTo fails with objects having different property values', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    const objectTwo = { a: 'a', b: { b1: 'b1', b2: '' } };
    /* eslint-enable id-length */
    const result = resultOfATestWith(assert => assert.that(objectOne).isEqualTo(objectTwo));
    
    expectFailureOn(result, "Expected { a: 'a', b: { b1: 'b1', b2: 'b2' } } to be equal to { a: 'a', b: { b1: 'b1', b2: '' } }");
  });
  
  test('isEqualTo fails if one object has less properties than the other', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b' };
    const objectTwo = { a: 'a', b: 'b', c: 'c' };
    /* eslint-enable id-length */
    const result = resultOfATestWith(assert => assert.that(objectOne).isEqualTo(objectTwo));
    
    expectFailureOn(result, "Expected { a: 'a', b: 'b' } to be equal to { a: 'a', b: 'b', c: 'c' }");
  });
  
  test('isEqualTo fails if one object has more properties than the other', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b', c: 'c' };
    const objectTwo = { a: 'a', b: 'b' };
    /* eslint-enable id-length */
    const result = resultOfATestWith(assert => assert.that(objectOne).isEqualTo(objectTwo));
    
    expectFailureOn(result, "Expected { a: 'a', b: 'b', c: 'c' } to be equal to { a: 'a', b: 'b' }");
  });
  
  test('isEqualTo with custom criteria fails if objects do not have that property', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b' };
    const objectTwo = { a: 'a', b: 'b' };
    /* eslint-enable id-length */
    const result = resultOfATestWith(assert => assert.areEqual(objectOne, objectTwo, 'notFound'));
    
    expectFailureOn(result, 'Expected { a: \'a\', b: \'b\' } to be equal to { a: \'a\', b: \'b\' } Equality check failed. Objects do not have \'notFound\' property');
  });
  
  test('isEqualTo with custom criteria passes if the criteria evaluates to true', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b1', myEqualMessage: () => true };
    const objectTwo = { a: 'a', b: 'b2', myEqualMessage: () => true };
    /* eslint-enable id-length */
    const result = resultOfATestWith(assert => assert.areEqual(objectOne, objectTwo, 'myEqualMessage'));
    
    expectSuccess(result);
  });
  
  test('isEqualTo with custom criteria passes if the criteria evaluates to true, and we are comparing instances of the same class', () => {
    class AClass {
      constructor(asd) {
        this.asd = asd;
      }
      myEqualMessage() {
        return true;
      }
    }
    const objectOne = new AClass();
    const objectTwo = new AClass();
    const result = resultOfATestWith(assert => assert.areEqual(objectOne, objectTwo, 'myEqualMessage'));
    
    expectSuccess(result);
  });
  
  test('isEqualTo with equals() default criteria passes if it evaluates to true, and we are comparing instances of the same class', () => {
    class AClass {
      constructor(asd) {
        this.asd = asd;
      }
      equals() {
        return true;
      }
    }
    const objectOne = new AClass(1);
    const objectTwo = new AClass(2);
    const result = resultOfATestWith(assert => assert.areEqual(objectOne, objectTwo));
    
    expectSuccess(result);
  });
  
  test('isEqualTo fails when comparing undefined with an object', () => {
    const resultOne = resultOfATestWith(assert => assert.areEqual(undefined, {}));
    const resultTwo = resultOfATestWith(assert => assert.areEqual({}, undefined));
    
    expectFailureOn(resultOne, 'Expected undefined to be equal to {}');
    expectFailureOn(resultTwo, 'Expected {} to be equal to undefined');
  });
  
  test('isEqualTo fails when comparing null with an object', () => {
    const resultOne = resultOfATestWith(assert => assert.areEqual(null, {}));
    const resultTwo = resultOfATestWith(assert => assert.areEqual({}, null));
    
    expectFailureOn(resultOne, 'Expected null to be equal to {}');
    expectFailureOn(resultTwo, 'Expected {} to be equal to null');
  });
  
  test('isEqualTo fails if both parts are undefined', () => {
    const result = resultOfATestWith(assert => assert.areEqual(undefined, undefined));
    expectFailureOn(result, 'Equality cannot be determined. Both parts are undefined');
  });
  
  test('isEqualTo fails with object with circular references', () => {
    const objectOne = { toString() {
      return 'circular!';
    } };
    objectOne.self = objectOne;
    const result = resultOfATestWith(assert => assert.areEqual(objectOne, objectOne));
    
    expectFailureOn(result, "Expected circular! to be equal to circular! (circular references found, equality check cannot be done. Please compare objects' properties individually)");
  });
});
