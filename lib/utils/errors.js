const errorDetailOf = thrownObject => (thrownObject instanceof Error) ? thrownObject.stack : thrownObject.toString();

/**
 * Detects the closest place where the user is calling the library code. This is helpful to report location of test
 * errors.
 *
 * @private
 * @returns {string} a stack trace line including file, row and column number (e.g.
 * `'/code/projects/awesome-project/tests/my_test.js:11:22'`). If it's not possible to determine it, returns an empty
 * string.
 */
const detectUserCallingLocation = () => {
  // the splice is to remove the error header and get only the stack trace part
  const stackTraceLines = new Error().stack.split('\n').splice(1);
  // the strategy is to navigate back on the stack trace until it finds a code that is not from the testy library
  // itself. In other words, is the place where we called Testy
  return stackTraceLines.find(line => !line.includes('testy/lib')) || '';
};

export {
  errorDetailOf,
  detectUserCallingLocation,
};
