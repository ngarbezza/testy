'use strict';

const { suite, test } = require('../../../testy');
const { asserter, expectSuccess, expectFailDueTo } = require('../../support/assertion_helpers');

suite('numeric assertions', () => {
  test('isNearTo passes if an exact integer matches', () => {
    asserter.that(42).isNearTo(42);
    
    expectSuccess();
  });
  
  test('isNearTo fails if the integer part of the number is not equal', () => {
    asserter.that(42).isNearTo(43);
    
    expectFailDueTo('Expected 42 to be near to 43 (using 4 precision digits)');
  });
  
  test('isNearTo passes if the actual number rounded using the specified decimals matches the expected number', () => {
    asserter.that(42.0001).isNearTo(42, 3);
  
    expectSuccess();
  });
  
  test('isNearTo fails if the actual number rounded using the specified decimals does not match the expected number', () => {
    asserter.that(42.001).isNearTo(42, 3);
  
    expectFailDueTo('Expected 42.001 to be near to 42 (using 3 precision digits)');
  });
  
  test('isNearTo passes with a default precision of 4', () => {
    asserter.that(42.00001).isNearTo(42);
  
    expectSuccess();
  });
  
  test('isNearTo passes with a classical floating point representation issue', () => {
    asserter.that(0.1 + 0.2).isNearTo(0.3);
    
    expectSuccess();
  });
});
