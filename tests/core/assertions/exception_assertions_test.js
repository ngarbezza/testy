'use strict';

const { suite, test } = require('../../../testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectSuccess, expectFailureOn } = require('../../support/assertion_helpers');

suite('exception assertions', () => {
  test('raises() can receive a string and it passes when the exact string is expected', () => {
    const result = resultOfATestWith(assert =>
      assert.that(() => {
        throw 'an error happened';
      }).raises('an error happened'),
    );
    
    expectSuccess(result);
  });
  
  test('raises() can receive a regex and it passes when it matches the thrown string', () => {
    const result = resultOfATestWith(assert =>
      assert.that(() => {
        throw 'an error happened';
      }).raises(/error/),
    );
    
    expectSuccess(result);
  });
  
  test('raises() can receive an arbitrary object and it passes when the exact object is expected', () => {
    const result = resultOfATestWith(assert =>
      assert.that(() => {
        throw { an: 'object' };
      }).raises({ an: 'object' }),
    );
  
    expectSuccess(result);
  });
  
  test('raises() can receive a regex and it passes when it matches the thrown error with message', () => {
    const result = resultOfATestWith(assert =>
      assert.that(() => {
        throw new TypeError('things happened');
      }).raises(/happened/),
    );
    
    expectSuccess(result);
  });
  
  test('raises() can receive a regex and it fails if there is not a match in the error message', () => {
    const result = resultOfATestWith(assert =>
      assert.that(() => {
        throw 'a terrible error';
      }).raises(/happiness/),
    );
    
    expectFailureOn(result, 'Expected error /happiness/ to happen, but got \'a terrible error\' instead');
  });
  
  test('raises() fails when no errors occur in the given function', () => {
    const result = resultOfATestWith(assert => assert.that(() => 1 + 2).raises('a weird error'));
    
    expectFailureOn(result, 'Expected error \'a weird error\' to happen');
  });
  
  test('doesNoRaiseAnyErrors() passes when no errors occur in the given function', () => {
    const result = resultOfATestWith(assert => assert.that(() => 1 + 2).doesNotRaiseAnyErrors());
    
    expectSuccess(result);
  });
  
  test('doesNoRaiseAnyErrors() fails when an error happens', () => {
    const result = resultOfATestWith(assert =>
      assert.that(() => {
        throw 'an unexpected error';
      }).doesNotRaiseAnyErrors(),
    );
  
    expectFailureOn(result, 'Expected no errors to happen, but \'an unexpected error\' was raised');
  });
});
