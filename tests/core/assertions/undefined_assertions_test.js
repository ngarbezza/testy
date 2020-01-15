'use strict';

const { suite, test } = require('../../../testy');
const { asserter, expectSuccess, expectFailureDueTo } = require('../../support/assertion_helpers');

suite('undefined assertions', () => {
  test('isUndefined passes with an undefined value', () => {
    asserter.isUndefined(undefined);
    
    expectSuccess();
  });
  
  test('isUndefined does not pass with a another value', () => {
    asserter.isUndefined(null);
    
    expectFailureDueTo('Expected null to be undefined');
  });

  test('isNotUndefined passes with a not-undefined value', () => {
    asserter.isNotUndefined(null);
    
    expectSuccess();
  });
  
  test('isNotUndefined does not pass when the value is undefined', () => {
    asserter.isNotUndefined(undefined);
    
    expectFailureDueTo('Expected undefined to be defined');
  });
});
