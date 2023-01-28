'use strict';

const { suite, test, assert } = require('../../lib/testy');
const { FailFast } = require('../../lib/config/fail_fast');

suite('fail fast behavior', () => {
  test('when enabled, initially has not failed', () => {
    const failFast = FailFast.enabled();

    assert.isFalse(failFast.hasFailed());
  });

  test('when enabled, after registering a failure becomes failed', () => {
    const failFast = FailFast.enabled();

    failFast.registerFailure();

    assert.isTrue(failFast.hasFailed());
  });

  test('when disabled, after registering a failure does not become failed', () => {
    const failFast = FailFast.disabled();

    failFast.registerFailure();

    assert.isFalse(failFast.hasFailed());
  });
});
