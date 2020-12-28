'use strict';

const { suite, test } = require('../../../testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectSuccess, expectFailureOn } = require('../../support/assertion_helpers');

const InternationalizedMessage = require('../../../lib/internationalized_message');

suite('boolean assertions', () => {
  test('isTrue passes with true', () => {
    const result = resultOfATestWith(assert => assert.that(true).isTrue());
    
    expectSuccess(result);
  });
  
  test('isTrue does not pass with false', () => {
    const result = resultOfATestWith(assert => assert.that(false).isTrue());
    
    expectFailureOn(result, new InternationalizedMessage('expectation_be_true', 'false'));
  });
  
  test('isTrue does not pass with another value', () => {
    const result = resultOfATestWith(assert => assert.that(null).isTrue());
    
    expectFailureOn(result, new InternationalizedMessage('expectation_be_true', 'null'));
  });
  
  test('isFalse passes with false', () => {
    const result = resultOfATestWith(assert => assert.that(false).isFalse());
    
    expectSuccess(result);
  });
  
  test('isFalse does not pass with true', () => {
    const result = resultOfATestWith(assert => assert.that(true).isFalse());
    
    expectFailureOn(result, new InternationalizedMessage('expectation_be_false', 'true'));
  });
  
  test('isFalse does not pass with another value', () => {
    const result = resultOfATestWith(assert => assert.that(null).isFalse());
    
    expectFailureOn(result, new InternationalizedMessage('expectation_be_false', 'null'));
  });
});
