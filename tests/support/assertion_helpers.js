'use strict';

import { assert } from '../../lib/testy.js';
import { I18nMessage } from '../../lib/i18n/i18n_messages.js';
import { I18n } from '../../lib/i18n/i18n.js';

const sourceCodeLocationRegex = /.* at .*:\d+:\d+/;

const expectSuccess = result => {
  assert.isTrue(result.isSuccess());
  assert.isEmpty(result.location());
};

const expectPendingResultOn = (result, reason) => {
  assert.isTrue(result.isPending());
  assert.isTrue(result.isExplicitlyMarkedPending());
  assert.areEqual(result.reason(), reason);
  assert.that(result.location()).matches(sourceCodeLocationRegex);
};

const expectFailureOn = (result, failureMessage) => {
  assert.isTrue(result.isFailure());
  assert.areEqual(result.failureMessage(), failureMessage);
  assert.that(result.location()).matches(sourceCodeLocationRegex);
};

const expectErrorOn = (result, errorMessage, locationRegex = sourceCodeLocationRegex) => {
  assert.isTrue(result.isError());
  assert.areEqual(result.failureMessage(), errorMessage);
  assert.that(result.location()).matches(locationRegex);

  if (errorMessage instanceof I18nMessage) {
    assert
      .that(() => errorMessage.associatedKeys().forEach(key => I18n.ensureKeyIsPresentOnAllLanguages(key)))
      .doesNotRaiseAnyErrors();
  }
};

export {
  expectSuccess,
  expectFailureOn,
  expectErrorOn,
  expectPendingResultOn,
  sourceCodeLocationRegex,
};
