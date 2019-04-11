'use strict';

const { suite, test, assert } = require('../../testy');
const TestSuite = require('../../lib/test_suite');

function newEmptySuite() { return suiteNamed('myTestSuite'); }
function suiteNamed(suiteName) { return new TestSuite(suiteName, () => {}, {}); }

suite('test suite behavior', () => {
  test('more than one before block is not allowed', () => {
    const mySuite = newEmptySuite();
    mySuite.before(() => 3 + 4);
    
    assert
      .that(() => mySuite.before(() => 5 + 6))
      .raises('There is already a before() block. Please leave just one before() block and run again the tests.');
  });
});
