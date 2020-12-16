'use strict';

const { suite, test } = require('../../../testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectSuccess, expectFailureOn } = require('../../support/assertion_helpers');

suite('boolean assertions', () => {
  test('isTrue passes with true', () => {
    const result = resultOfATestWith(assert => assert.that(true).isTrue());
    
    expectSuccess(result);
  });
  
  test('isTrue does not pass with false', () => {
    const result = resultOfATestWith(assert => assert.that(false).isTrue());
    
    expectFailureOn(result, 'Expected false to be true');
  });
  
  test('isTrue does not pass with another value', () => {
    const result = resultOfATestWith(assert => assert.that(null).isTrue());
    
    expectFailureOn(result, 'Expected null to be true');
  });
  
  test('isFalse passes with false', () => {
    const result = resultOfATestWith(assert => assert.that(false).isFalse());
    
    expectSuccess(result);
  });
  
  test('isFalse does not pass with true', () => {
    const result = resultOfATestWith(assert => assert.that(true).isFalse());
    
    expectFailureOn(result, 'Expected true to be false');
  });
  
  test('isFalse does not pass with another value', () => {
    const result = resultOfATestWith(assert => assert.that(null).isFalse());
    
    expectFailureOn(result, 'Expected null to be false');
  });
});
