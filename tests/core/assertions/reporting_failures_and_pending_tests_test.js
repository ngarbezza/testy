'use strict';

const { suite, test, pending } = require('../../../testy');
const { failGenerator, pendingMarker, expectFailureDueTo, expectPendingResultDueTo } = require('../../support/assertion_helpers');

suite('reporting failures and pending tests', () => {
  test('marking a test as explicitly failed with no message', () => {
    failGenerator.with();
    
    expectFailureDueTo('Explicitly failed');
  });
  
  test('marking a test as explicitly failed with no message', () => {
    failGenerator.with('I should not be here!');
    
    expectFailureDueTo('I should not be here!');
  });
  
  test('marking a test as pending with no message', () => {
    pending.dueTo('Need to fix this bug: https://github.com/ngarbezza/testy/issues/172');
    // pendingMarker.dueTo();
    // expectErrorDueTo('aaaaaa');
  });
  
  test('marking a test as pending with a custom message', () => {
    pendingMarker.dueTo('No time to fix!');
    
    expectPendingResultDueTo('No time to fix!');
  });
});
