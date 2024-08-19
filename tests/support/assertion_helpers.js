'use strict';

import { assert } from '../../lib/testy.js';
import { I18nMessage } from '../../lib/i18n/i18n_messages.js';
import { I18n } from '../../lib/i18n/i18n.js';

const sourceCodeLocationRegex = /.* at .*:\d+:\d+/;

const expectSuccess = result => {
  // my status
  assert.isTrue(result.isSuccess());
  assert.isEmpty(result.location());

  // other statuses
  assert.isFalse(result.isFailure());
  assert.isFalse(result.isError());
  assert.isFalse(result.isPending());
  assert.isFalse(result.isSkipped());
};

const expectPendingResultOn = (result, reason) => {
  // my status
  assert.isTrue(result.isPending());
  assert.isTrue(result.isExplicitlyMarkedPending());
  assert.areEqual(result.reason(), reason);
  assert.that(result.location()).matches(sourceCodeLocationRegex);

  // other statuses
  assert.isFalse(result.isSuccess());
  assert.isFalse(result.isSkipped());
  assert.isFalse(result.isFailure());
  assert.isFalse(result.isError());
};

const expectFailureOn = (result, failureMessage) => {
  // my status
  assert.isTrue(result.isFailure());
  assert.areEqual(result.failureMessage(), failureMessage);
  assert.that(result.location()).matches(sourceCodeLocationRegex);

  // other statuses
  assert.isFalse(result.isSuccess());
  assert.isFalse(result.isError());
  assert.isFalse(result.isSkipped());
  assert.isFalse(result.isPending());
};

const expectErrorOn = (result, errorMessage, locationRegex = sourceCodeLocationRegex) => {
  // my status
  assert.isTrue(result.isError());
  assert.areEqual(result.failureMessage(), errorMessage);
  assert.that(result.location()).matches(locationRegex);

  // other statuses
  assert.isFalse(result.isSuccess());
  assert.isFalse(result.isFailure());
  assert.isFalse(result.isSkipped());
  assert.isFalse(result.isPending());

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
