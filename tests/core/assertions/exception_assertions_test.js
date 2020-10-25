'use strict';

const { suite, test } = require('../../../testy');
const { asserter, expectSuccess, expectFailureDueTo } = require('../../support/assertion_helpers');

suite('exception assertions', () => {
  test('raises() can receive a string and it passes when the exact string is expected', () => {
    asserter.that(() => {
      throw 'an error happened'; 
    }).raises('an error happened');
    
    expectSuccess();
  });
  
  test('raises() can receive a regex and it passes when it matches the thrown string', () => {
    asserter.that(() => {
      throw 'an error happened'; 
    }).raises(/error/);
    
    expectSuccess();
  });
  
  test('raises() can receive an arbitrary object and it passes when the exact object is expected', () => {
    asserter.that(() => {
      throw { an: 'object' }; 
    }).raises({ an: 'object' });
  
    expectSuccess();
  });
  
  test('raises() can receive a regex and it passes when it matches the thrown error with message', () => {
    asserter.that(() => {
      throw new TypeError('things happened'); 
    }).raises(/happened/);
    
    expectSuccess();
  });
  
  test('raises() can receive a regex and it fails if there is not a match in the error message', () => {
    asserter.that(() => {
      throw 'a terrible error'; 
    }).raises(/happiness/);
    
    expectFailureDueTo('Expected error /happiness/ to happen, but got \'a terrible error\' instead');
  });
});
