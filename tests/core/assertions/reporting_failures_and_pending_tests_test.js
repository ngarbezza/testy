'use strict';

const { suite, test } = require('../../../testy');
const { failGenerator, pendingMarker, expectErrorDueTo, expectFailureDueTo, expectPendingResultDueTo } = require('../../support/assertion_helpers');

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
    pendingMarker.dueTo();
    
    expectErrorDueTo('In order to mark a test as pending, you need to specify a reason.');
  });
  
  test('marking a test as pending with a custom message', () => {
    pendingMarker.dueTo('No time to fix!');
    
    expectPendingResultDueTo('No time to fix!');
  });
});
