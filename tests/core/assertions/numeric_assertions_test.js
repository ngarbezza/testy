'use strict';

const { suite, test } = require('../../../testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectSuccess, expectFailureOn } = require('../../support/assertion_helpers');

suite('numeric assertions', () => {
  test('isNearTo passes if an exact integer matches', () => {
    const result = resultOfATestWith(assert => assert.that(42).isNearTo(42));
    
    expectSuccess(result);
  });
  
  test('isNearTo fails if the integer part of the number is not equal', () => {
    const result = resultOfATestWith(assert => assert.that(42).isNearTo(43));
    
    expectFailureOn(result, 'Expected 42 to be near to 43 (using 4 precision digits)');
  });
  
  test('isNearTo passes if the actual number rounded using the specified decimals matches the expected number', () => {
    const result = resultOfATestWith(assert => assert.that(42.0001).isNearTo(42, 3));
  
    expectSuccess(result);
  });
  
  test('isNearTo fails if the actual number rounded using the specified decimals does not match the expected number', () => {
    const result = resultOfATestWith(assert => assert.that(42.001).isNearTo(42, 3));
  
    expectFailureOn(result, 'Expected 42.001 to be near to 42 (using 3 precision digits)');
  });
  
  test('isNearTo passes with a default precision of 4', () => {
    const result = resultOfATestWith(assert => assert.that(42.00001).isNearTo(42));
  
    expectSuccess(result);
  });
  
  test('isNearTo passes with a classical floating point representation issue', () => {
    const result = resultOfATestWith(assert => assert.that(0.1 + 0.2).isNearTo(0.3));
    
    expectSuccess(result);
  });
});
