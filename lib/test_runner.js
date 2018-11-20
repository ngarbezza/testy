const { Test } = require('./test');
const { TestSuite } = require('./test_suite');
const { Asserter } = require('./asserter');

class TestRunner {
  constructor() {
    this._asserter = new Asserter(this);
    this.register();
  }
  
  register() { global.__testy__ = this; }
  currentSuite() { return this._currentSuite; }
  setCurrentSuite(suite) { this._currentSuite = suite; }
  registerSuite(name, suiteBody, callbacks) {
    let suite = new TestSuite(name, suiteBody);
    this.setCurrentSuite(suite);
    suite.run(callbacks);
  }
  registerTest(name, testBody, callbacks) {
    let test = new Test(name, testBody, callbacks);
    this.currentSuite().addTest(test);
  }
  registerBefore(beforeBlock) {
    this.currentSuite().before(beforeBlock);
  }
  availableAssertions() {
    return {
      isEqualTo: (expected, criteria) => this._asserter.isEqualTo(expected, criteria),
      includes: (value) => this._asserter.includes(value),
      raises: (error) => this._asserter.raises(error),
      assertThat: (a, e) => this._asserter.assertThat(a, e),
      assertEquals: (a, e, c) => this._asserter.assertEquals(a, e, c),
      assertTrue: (b) => this._asserter.assertTrue(b),
      assertFalse: (b) => this._asserter.assertFalse(b),
      fail: (m) => this._asserter.fail(m),
    };
  }
}

module.exports = { TestRunner: TestRunner };