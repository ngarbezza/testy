'use strict';

const Test = require('./test');
const TestSuite = require('./test_suite');
const Asserter = require('./asserter');

class TestRunner {
  constructor(callbacks) {
    this._asserter = new Asserter(this);
    this._suites = [];
    this._callbacks = callbacks;
    this.register();
  }
  
  register() { global.__testy__ = this; }
  currentSuite() { return this._currentSuite; }
  suites() { return this._suites; }
  setCurrentSuite(suite) { this._currentSuite = suite; }
  registerSuite(name, suiteBody, callbacks) {
    let suite = new TestSuite(name, suiteBody, callbacks);
    this.suites().push(suite);
    this.setCurrentSuite(suite);
    return suite;
  }
  registerTest(name, testBody, callbacks) {
    let test = new Test(name, testBody, callbacks);
    this.currentSuite().addTest(test);
  }
  registerBefore(beforeBlock) {
    this.currentSuite().before(beforeBlock);
  }
  run() {
    this.suites().forEach(suite => {
      this.setCurrentSuite(suite);
      suite.run();
    });
    this._callbacks.onFinish(this);
  }
  
  successCount() { return this._aggregateResultsBy('successCount'); }
  pendingCount() { return this._aggregateResultsBy('pendingCount'); }
  errorsCount() { return this._aggregateResultsBy('errorsCount'); }
  failuresCount() { return this._aggregateResultsBy('failuresCount'); }
  totalCount() { return this._aggregateResultsBy('totalCount'); }
  
  availableAssertions() {
    return {
      isEqualTo: (expected, criteria) => this._asserter.isEqualTo(expected, criteria),
      isNotEqualTo: (expected, criteria) => this._asserter.isNotEqualTo(expected, criteria),
      includes: (value) => this._asserter.includes(value),
      raises: (error) => this._asserter.raises(error),
      doesNotRaise: (error) => this._asserter.doesNotRaise(error),
      doesNotRaiseAnyErrors: () => this._asserter.doesNotRaiseAnyErrors(),
      assertThat: (a, e) => this._asserter.assertThat(a, e),
      assertEquals: (a, e, c) => this._asserter.assertEquals(a, e, c),
      assertTrue: (b) => this._asserter.assertTrue(b),
      assertFalse: (b) => this._asserter.assertFalse(b),
      fail: (m) => this._asserter.fail(m),
    };
  }
  
  finish(callbacks) {
    return this._considerResultAsSucceeded() ? callbacks.success() : callbacks.failure();
  }
  
  _considerResultAsSucceeded() {
    return this.errorsCount() + this.failuresCount() === 0;
  }
  
  _aggregateResultsBy(property) {
    return this.suites().reduce((count, suite) => count + suite[property](), 0);
  }
}

module.exports = TestRunner;
