let pp = object => JSON.stringify(object);

exports.isEqualTo = expected =>
  actual => ({
    success: actual === expected,
    failureMessage: `Expected ${pp(actual)} to equal ${pp(expected)}`
  });

exports.includes = value =>
  list => ({
    success: list.includes(value),
    failureMessage: `Expected ${pp(list)} to include ${pp(value)}`
  });

exports.raises = expectedError =>
  code => {
    try {
      code();
      return {
        success: false,
        failureMessage: `Expected error ${pp(expectedError)} to happen`
      }
    }
    catch(actualError) {
      return exports.assertThat(actualError, exports.isEqualTo(expectedError))
    }
  };

exports.assertThat = (actual, expectation) => expectation(actual);
exports.assertEquals = (actual, expected) => exports.assertThat(actual, exports.isEqualTo(expected));
exports.assertTrue = boolean => exports.assertEquals(boolean, true);
exports.assertFalse = boolean => exports.assertEquals(boolean, false);

exports.test = function(name, testBody) {
  if (testBody === undefined) {
    console.log(`[WIP] ${name}`);
    return null
  }
  let assertion = (typeof testBody === 'function') ? testBody() : testBody;
  if (assertion.success) {
    console.log(`[OK] ${name}`)
  } else {
    console.log(`[FAIL] ${name}`);
    console.log(`  => ${assertion.failureMessage}`)
  }
  return assertion.success
};

exports.suite = function(name, ...tests) {
  console.log(`${name} summary:`);
  let total = tests.length;
  let success = tests.filter(testResult => testResult).length;
  let pending = tests.filter(testResult => testResult === null).length;
  let failures = total - success - pending;
  console.log(`${total} tests, ${success} passed, ${failures} failed, ${pending} pending`)
};