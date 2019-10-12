'use strict';

const { suite, test } = require('../../../testy');
const { asserter, expectSuccess, expectFailDueTo } = require('../../support/assertion_helpers');

suite('boolean assertions', () => {
  test('isTrue passes with true', () => {
    asserter.that(true).isTrue();
    
    expectSuccess();
  });
  
  test('isTrue does not pass with false', () => {
    asserter.that(false).isTrue();
    
    expectFailDueTo('Expected false to be true');
  });
  
  test('isTrue does not pass with another value', () => {
    asserter.that(null).isTrue();
    
    expectFailDueTo('Expected null to be true');
  });
  
  test('isFalse passes with false', () => {
    asserter.that(false).isFalse();
    
    expectSuccess();
  });
  
  test('isFalse does not pass with true', () => {
    asserter.that(true).isFalse();
    
    expectFailDueTo('Expected true to be false');
  });
  
  test('isFalse does not pass with another value', () => {
    asserter.that(null).isFalse();
    
    expectFailDueTo('Expected null to be false');
  });
});
