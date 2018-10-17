const assert = require('assert');

let pp = object => JSON.stringify(object);

let isEqualTo = expected =>
  actual => {
    let success = true;
    try { assert.deepStrictEqual(actual, expected) }
    catch(assertionError) { success = false }
    
    return {
      success: success,
      failureMessage: `Expected ${pp(actual)} to equal ${pp(expected)}`
    };
  };

let includes = value =>
  list => ({
    success: list.includes(value),
    failureMessage: `Expected ${pp(list)} to include ${pp(value)}`
  });

let raises = expectedError =>
  code => {
    try {
      code();
      return {
        success: false,
        failureMessage: `Expected error ${pp(expectedError)} to happen`
      }
    }
    catch(actualError) {
      return assertThat(actualError, isEqualTo(expectedError))
    }
  };

let assertThat = (actual, expectation) => expectation(actual);
let assertEquals = (actual, expected) => assertThat(actual, isEqualTo(expected));
let assertTrue = boolean => assertEquals(boolean, true);
let assertFalse = boolean => assertEquals(boolean, false);

module.exports = {
  isEqualTo: isEqualTo,
  includes: includes,
  raises: raises,
  assertThat: assertThat,
  assertEquals: assertEquals,
  assertTrue: assertTrue,
  assertFalse: assertFalse,
};