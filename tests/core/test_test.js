'use strict';

const { suite, test } = require('../../testy');
const { aTestWithNoAssertions } = require('../support/tests_factory');
const { expectErrorOn } = require('../support/assertion_helpers');

suite('tests behavior', () => {
  test('running a test that does not have any assertion generates an error with a descriptive message', () => {
    const testToRun = aTestWithNoAssertions();
    
    testToRun.run();
    
    expectErrorOn(testToRun, 'This test does not have any assertions');
  });
});
