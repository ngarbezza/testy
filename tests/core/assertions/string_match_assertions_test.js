'use strict';

const { suite, test } = require('../../../testy');
const { asserter, expectSuccess, expectFailureDueTo } = require('../../support/assertion_helpers');

suite('assertions about strings match', () => {
  test('matches() passes when the regex match the actual string', () => {
    asserter.that('hello').matches(/ll/);
    
    expectSuccess();
  });
  
  test('matches() fails when the regex does the actual string', () => {
    asserter.that('goodbye').matches(/ll/);
    
    expectFailureDueTo("Expected 'goodbye' to match /ll/");
  });
  
  test('isMatching() shortcut works', () => {
    asserter.isMatching('hello', /ll/);
    
    expectSuccess();
  });
  
  test('matches() passes with a exact string', () => {
    asserter.that('hola').matches('hola');
    
    expectSuccess();
  });
});
