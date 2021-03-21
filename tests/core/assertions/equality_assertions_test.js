'use strict';

const { suite, test } = require('../../../testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectSuccess, expectFailureOn } = require('../../support/assertion_helpers');

const { I18nMessage } = require('../../../lib/i18n');

suite('equality assertions', () => {
  test('isEqualTo pass with equal primitive objects', () => {
    const result = resultOfATestWith(assert => assert.that(42).isEqualTo(42));
    
    expectSuccess(result);
  });
  
  test('isEqualTo fails with different primitive objects', () => {
    const result = resultOfATestWith(assert => assert.that(42).isEqualTo(21));
    
    expectFailureOn(result, I18nMessage.of('equality_assertion_be_equal_to', '42', '21'));
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
    
    expectFailureOn(result, I18nMessage.of('equality_assertion_be_equal_to', '[ 1, 2, 3 ]', '[ 1, 3, 2 ]'));
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
    
    expectFailureOn(result, I18nMessage.of('equality_assertion_be_equal_to', "{ a: 'a', b: { b1: 'b1', b2: 'b2' } }", "{ a: 'a', b: { b1: 'b1', b2: '' } }"));
  });
  
  test('isEqualTo fails if one object has less properties than the other', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b' };
    const objectTwo = { a: 'a', b: 'b', c: 'c' };
    /* eslint-enable id-length */
    const result = resultOfATestWith(assert => assert.that(objectOne).isEqualTo(objectTwo));
    
    expectFailureOn(result, I18nMessage.of('equality_assertion_be_equal_to', "{ a: 'a', b: 'b' }", "{ a: 'a', b: 'b', c: 'c' }"));
  });
  
  test('isEqualTo fails if one object has more properties than the other', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b', c: 'c' };
    const objectTwo = { a: 'a', b: 'b' };
    /* eslint-enable id-length */
    const result = resultOfATestWith(assert => assert.that(objectOne).isEqualTo(objectTwo));
    
    expectFailureOn(result, I18nMessage.of('equality_assertion_be_equal_to', "{ a: 'a', b: 'b', c: 'c' }", "{ a: 'a', b: 'b' }"));
  });
  
  test('isEqualTo with custom criteria fails if objects do not have that property', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b' };
    const objectTwo = { a: 'a', b: 'b' };
    /* eslint-enable id-length */
    const result = resultOfATestWith(assert => assert.areEqual(objectOne, objectTwo, 'notFound'));
  
    const assertionMessage = I18nMessage.of('equality_assertion_be_equal_to', "{ a: 'a', b: 'b' }", "{ a: 'a', b: 'b' }");
    const additionalMessage = I18nMessage.of('equality_assertion_failed_due_to_missing_property', 'notFound');
    expectFailureOn(result, I18nMessage.joined([assertionMessage, additionalMessage], ' '));
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
    
    expectFailureOn(resultOne, I18nMessage.of('equality_assertion_be_equal_to', 'undefined', '{}'));
    expectFailureOn(resultTwo, I18nMessage.of('equality_assertion_be_equal_to', '{}', 'undefined'));
  });
  
  test('isEqualTo fails when comparing null with an object', () => {
    const resultOne = resultOfATestWith(assert => assert.areEqual(null, {}));
    const resultTwo = resultOfATestWith(assert => assert.areEqual({}, null));
    
    expectFailureOn(resultOne, I18nMessage.of('equality_assertion_be_equal_to', 'null', '{}'));
    expectFailureOn(resultTwo, I18nMessage.of('equality_assertion_be_equal_to', '{}', 'null'));
  });
  
  test('isEqualTo fails if both parts are undefined', () => {
    const result = resultOfATestWith(assert => assert.areEqual(undefined, undefined));
    expectFailureOn(result, I18nMessage.of('equality_assertion_failed_due_to_undetermination'));
  });
  
  test('isEqualTo fails with object with circular references', () => {
    const objectOne = { toString() {
      return 'circular!';
    } };
    objectOne.self = objectOne;
    const result = resultOfATestWith(assert => assert.areEqual(objectOne, objectOne));
  
    const assertionMessage = I18nMessage.of('equality_assertion_be_equal_to', 'circular!', 'circular!');
    const additionalMessage = I18nMessage.of('equality_assertion_failed_due_to_circular_references');
    expectFailureOn(result, I18nMessage.joined([assertionMessage, additionalMessage], ' '));
  });

  test('isNotEqualTo fails if both parts are undefined', () => { 
    const result = resultOfATestWith(assert => assert.that(undefined).isNotEqualTo(undefined)); 
    expectFailureOn(result, I18nMessage.of('equality_assertion_failed_due_to_undetermination')); 
  });
});
