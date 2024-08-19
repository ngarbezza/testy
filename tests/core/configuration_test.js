'use strict';

import { assert, suite, test } from '../../lib/testy.js';

import { Configuration } from '../../lib/config/configuration.js';
import { FailFast } from '../../lib/config/fail_fast.js';

suite('Configuration parameters', () => {
  const emptyOptions = {};
  const defaultConfiguration = {
    directory: 'some_dir',
    filter: '.*_test.js$',
    language: 'de',
    failFast: false,
    randomOrder: true,
    timeoutMs: 1000,
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

  test('there is a default timeout in milliseconds setting', () => {
    assert.areEqual(configuration.timeoutMs(), 1000);
  });

  test('user preference has higher precedence than defaults', () => {
    const userOptions = { directory: 'test_files_here' };
    const userCustomizedConfiguration = new Configuration(userOptions, defaultConfiguration);
    assert.areEqual(userCustomizedConfiguration.directory(), 'test_files_here');
  });

  test('there is an error when failFast option is not a boolean', () => {
    const userOptions = { failFast: 'I AM AN INVALID VALUE' };
    const userCustomizedConfiguration = new Configuration(userOptions, defaultConfiguration);
    assert.that(() => userCustomizedConfiguration.failFastMode())
      .raises(new Error('Expected a boolean value for failFast configuration'));
  });
});
