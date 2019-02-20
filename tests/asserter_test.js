'use strict';

const { suite, test, assert } = require('../testy');
const { Asserter } = require('../lib/asserter');

const fakeRunner = {
  setResultForCurrentTest(result) { this._result = result; },
  result() { return this._result; }
};
const asserter = new Asserter(fakeRunner);

function expectFailDueTo(failureMessage) {
  assert.isFalse(fakeRunner.result().success);
  assert.areEqual(fakeRunner.result().failureMessage, failureMessage);
}

function expectSuccess() {
  assert.isTrue(fakeRunner.result().success);
}

suite('assertions behavior', () => {
  test('isTrue passes with true', () => {
    asserter.that(true).isTrue();
    
    expectSuccess();
  });
  
  test('isTrue does not pass with false', () => {
    asserter.that(false).isTrue();

    expectFailDueTo('Expected false to be true');
  });
  
  test('isTrue does not pass with another value', () => {
    asserter.that(null).isTrue();
    
    expectFailDueTo('Expected null to be true');
  });
  
  test('isFalse passes with false', () => {
    asserter.that(false).isFalse();
    
    expectSuccess();
  });
  
  test('isFalse does not pass with true', () => {
    asserter.that(true).isFalse();
    
    expectFailDueTo('Expected true to be false');
  });
  
  test('isFalse does not pass with another value', () => {
    asserter.that(null).isFalse();
    
    expectFailDueTo('Expected null to be false');
  });
});
