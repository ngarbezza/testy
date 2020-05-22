'use strict';

const { suite, test } = require('../../../testy');
const { asserter, expectSuccess, expectFailureDueTo } = require('../../support/assertion_helpers');

suite('assertions about null', () => {
  test('isNull passes with a null value', () => {
    asserter.isNull(null);
    
    expectSuccess();
  });
  
  test('isNull does not pass with a another value', () => {
    asserter.isNull(undefined);
    
    expectFailureDueTo('Expected undefined to be null');
  });

  test('isNotNull passes with a non-null value', () => {
    asserter.isNotNull(3);
    
    expectSuccess();
  });
  
  test('isNotNull does not pass when the value is null', () => {
    asserter.isNotNull(null);
    
    expectFailureDueTo('Expected null to be not null');
  });
});
