const assert = require('assert');

class Asserter {
  constructor(runner) { this._runner = runner }
  
  registerAssertion(result) {
    this._runner.currentSuite().currentTest().setResult(result);
  }
  
  isEqualTo(expected) {
    return actual => {
      let success = true;
      try { assert.deepStrictEqual(actual, expected) }
      catch (assertionError) { success = false }
  
      return {
        success: success,
        failureMessage: `Expected ${this.prettyPrint(actual)} to equal ${this.prettyPrint(expected)}`
      }
    }
  }
  
  includes(value) {
    return list => ({
      success: list.includes(value),
      failureMessage: `Expected ${this.prettyPrint(list)} to include ${this.prettyPrint(value)}`
    })
  }
  
  raises(expectedError) {
    return code => {
      try {
        code();
        return {
          success: false,
          failureMessage: `Expected error ${this.prettyPrint(expectedError)} to happen`
        }
      }
      catch(actualError) {
        return this.isEqualTo(expectedError)(actualError)
      }
    }
  }
  
  assertThat(actual, expectation) {
    this.registerAssertion(expectation(actual))
  }
  assertEquals(actual, expected) {
    this.assertThat(actual, this.isEqualTo(expected))
  }
  assertTrue(boolean) { this.assertEquals(boolean, true) }
  assertFalse(boolean) { this.assertEquals(boolean, false) }
  
  prettyPrint(object) { return JSON.stringify(object) }
}

module.exports = { Asserter: Asserter };