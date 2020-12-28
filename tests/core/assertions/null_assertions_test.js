'use strict';

const { suite, test } = require('../../../testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectSuccess, expectFailureOn } = require('../../support/assertion_helpers');

const InternationalizedMessage = require('../../../lib/internationalized_message');

suite('assertions about null', () => {
  test('isNull passes with a null value', () => {
    const result = resultOfATestWith(assert => assert.isNull(null));
    
    expectSuccess(result);
  });
  
  test('isNull does not pass with a another value', () => {
    const result = resultOfATestWith(assert => assert.isNull(undefined));
    
    expectFailureOn(result, new InternationalizedMessage('expectation_be_null', 'undefined'));
  });

  test('isNotNull passes with a non-null value', () => {
    const result = resultOfATestWith(assert => assert.isNotNull(3));
    
    expectSuccess(result);
  });
  
  test('isNotNull does not pass when the value is null', () => {
    const result = resultOfATestWith(assert => assert.isNotNull(null));
    
    expectFailureOn(result, new InternationalizedMessage('expectation_be_not_null', 'null'));
  });
});
