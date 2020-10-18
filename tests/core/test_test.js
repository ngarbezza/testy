'use strict';

const { suite, test, assert } = require('../../testy');
const Test = require('../../lib/test');
const { aTestWithNoAssertions } = require('../support/tests_factory');
const { expectErrorOn } = require('../support/assertion_helpers');

suite('tests behavior', () => {
  test('running a test that does not have any assertion generates an error with a descriptive message', () => {
    const testToRun = aTestWithNoAssertions();
    
    testToRun.run();
    
    expectErrorOn(testToRun, 'This test does not have any assertions');
  });

  test('a test cannot be created without a name', () => {
    assert.that(() => new Test()).raises('Test does not have a valid name');
  });
  
  test('a test cannot be created with a name that is not a string', () => {
    assert.that(() => new Test(new Date())).raises('Test does not have a valid name');
  });
  
  test('a test can be created with undefined body', () => {
    assert.that(() => new Test('hey', undefined)).doesNotRaise('Test does not have a valid body');
  });

  test('a test cannot be created without a body', () => {
    assert.that(() => new Test('hey', null)).raises('Test does not have a valid body');
  });
  
  test('a test cannot be created with a body that is not a function', () => {
    assert.that(() => new Test('hey', 'ho')).raises('Test does not have a valid body');
  });

  test('a test cannot be created with name empty', () => {
    assert.that(() => new Test('', undefined)).raises('Suite and test names cannot be empty');
  });
});
