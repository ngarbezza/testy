'use strict';

const { suite, test, assert } = require('../../lib/testy');
const { Configuration } = require('../../lib/config/configuration');
const { FailFast } = require('../../lib/config/fail_fast');

suite('Configuration parameters', () => {
  const emptyOptions = {};
  const defaultConfiguration = {
    directory: 'some_dir',
    filter: '.*_test.js$',
    language: 'de',
    failFast: false,
    randomOrder: true,
  };
  const configuration = new Configuration(emptyOptions, defaultConfiguration);

  test('there is a default directory', () => {
    assert.areEqual(configuration.directory(), 'some_dir');
  });

  test('the default files filter exists and it is a regex', () => {
    assert.areEqual(configuration.filter(), /.*_test.js$/);
  });

  test('there is a default language', () => {
    assert.areEqual(configuration.language(), 'de');
  });

  test('there is a default fail fast setting', () => {
    assert.areEqual(configuration.failFastMode(), FailFast.default());
  });

  test('there is a default random order setting', () => {
    assert.areEqual(configuration.randomOrder(), true);
  });

  test('user preference has higher precedence than defaults', () => {
    const userOptions = { directory: 'test_files_here' };
    const userCustomizedConfiguration = new Configuration(userOptions, defaultConfiguration);
    assert.areEqual(userCustomizedConfiguration.directory(), 'test_files_here');
  });
});
