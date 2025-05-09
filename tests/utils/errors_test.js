import { assert, suite, test } from '../../lib/testy.js';
import { detectUserCallingLocation, errorDetailOf } from '../../lib/utils/errors.js';
import { sourceCodeLocationRegex } from '../support/assertion_helpers.js';

suite('error utilities', () => {
  test('errorDetailOf() returns stack trace if the thrown object is an error', () => {
    const thrownObject = new Error('oops I did it again');
    assert.areEqual(errorDetailOf(thrownObject), thrownObject.stack);
  });

  test('errorDetailOf() returns the string contents if the thrown object is a string', () => {
    const thrownObject = 'oops I did it again';
    assert.areEqual(errorDetailOf(thrownObject), 'oops I did it again');
  });

  test('errorDetailOf() returns the string representation if the thrown object is not a string', () => {
    const thrownObject = [1, 2, 3];
    assert.areEqual(errorDetailOf(thrownObject), '1,2,3');
  });

  test('detectUserCallingLocation() reports a valid location', () => {
    assert.that(detectUserCallingLocation()).matches(sourceCodeLocationRegex);
  });
});
