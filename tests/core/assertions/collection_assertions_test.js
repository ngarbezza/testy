'use strict';

const { suite, test } = require('../../../testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectSuccess, expectFailureOn } = require('../../support/assertion_helpers');

const Utils = require('../../../lib/utils');
const { I18nMessage } = require('../../../lib/i18n');

suite('collection assertions', () => {
  const nonEmptySet = new Set([1]);
  const emptySet = new Set([]);

  test('includes passes if the object is in the array', () => {
    const result = resultOfATestWith(assert => assert.that(['hey']).includes('hey'));

    expectSuccess(result);
  });

  test('includes does not pass if the actual object is not an array', () => {
    const result = resultOfATestWith(assert => assert.that([]).includes('hey'));

    expectFailureOn(result, I18nMessage.of('expectation_include', '[]', "'hey'"));
  });

  test('includes works with non-primitives', () => {
    const result = resultOfATestWith(assert => assert.that([{ asd: '1' }]).includes({ asd: '1' }));

    expectSuccess(result);
  });

  test('doesNotInclude fails if the object is in the array', () => {
    const result = resultOfATestWith(assert => assert.that(['hey']).doesNotInclude('hey'));

    expectFailureOn(result, I18nMessage.of('expectation_not_include', "[ 'hey' ]", "'hey'"));
  });

  test('doesNotInclude passes if the object is not an array', () => {
    const result = resultOfATestWith(assert => assert.that([]).doesNotInclude('hey'));

    expectSuccess(result);
  });

  test('doesNotInclude fails properly with non-primitives', () => {
    const result = resultOfATestWith(assert => assert.that([{ asd: '1' }]).doesNotInclude({ asd: '1' }));

    expectFailureOn(result, I18nMessage.of('expectation_not_include', "[ { asd: '1' } ]", "{ asd: '1' }"));
  });

  test('includesExactly passes with a single object included', () => {
    const result = resultOfATestWith(assert => assert.that(['hey']).includesExactly('hey'));

    expectSuccess(result);
  });

  test('includesExactly passes using a non-primitive single object', () => {
    const result = resultOfATestWith(assert => assert.that([{ asd: '1' }]).includesExactly({ asd: '1' }));

    expectSuccess(result);
  });

  test('includesExactly fails if the collection has more objects than expected', () => {
    const result = resultOfATestWith(assert => assert.that(['hey', 'ho']).includesExactly('hey'));

    expectFailureOn(result, I18nMessage.of('expectation_include_exactly', "[ 'hey', 'ho' ]", "[ 'hey' ]"));
  });

  test('includesExactly fails if the collection has less objects than expected', () => {
    const result = resultOfATestWith(assert => assert.that(['hey']).includesExactly('hey', 'ho'));

    expectFailureOn(result, I18nMessage.of('expectation_include_exactly', "[ 'hey' ]", "[ 'hey', 'ho' ]"));
  });

  test('includesExactly fails if none of the objects are included at all', () => {
    const result = resultOfATestWith(assert => assert.that(['hey']).includesExactly('ho'));

    expectFailureOn(result, I18nMessage.of('expectation_include_exactly', "[ 'hey' ]", "[ 'ho' ]"));
  });

  test('includesExactly passes with many items no matter the order', () => {
    const result = resultOfATestWith(assert => assert.that(['hey', 'ho']).includesExactly('ho', 'hey'));

    expectSuccess(result);
  });

  test('includesExactly passes on a Set', () => {
    const result = resultOfATestWith(assert => assert.that(new Set(['hey', 'ho'])).includesExactly('ho', 'hey'));

    expectSuccess(result);
  });

  test('isEmpty passes on an empty array', () => {
    const result = resultOfATestWith(assert => assert.that([]).isEmpty());

    expectSuccess(result);
  });

  test('isEmpty does not pass if the array has elements', () => {
    const result = resultOfATestWith(assert => assert.that(['hey']).isEmpty());

    expectFailureOn(result, I18nMessage.of('expectation_be_empty', "[ 'hey' ]"));
  });

  test('isEmpty passes with an empty string', () => {
    const result = resultOfATestWith(assert => assert.that('').isEmpty());

    expectSuccess(result);
  });

  test('isEmpty shorthand works', () => {
    const result = resultOfATestWith(assert => assert.isEmpty([]));

    expectSuccess(result);
  });

  test('isNotEmpty passes on an array with element', () => {
    const result = resultOfATestWith(assert => assert.that(['hey']).isNotEmpty());

    expectSuccess(result);
  });

  test('isNotEmpty does not pass if the array is empty', () => {
    const result = resultOfATestWith(assert => assert.that([]).isNotEmpty());

    expectFailureOn(result, I18nMessage.of('expectation_be_not_empty', '[]'));
  });

  test('isNotEmpty passes with a string with content', () => {
    const result = resultOfATestWith(assert => assert.that('hey').isNotEmpty());

    expectSuccess(result);
  });

  test('isNotEmpty shorthand works', () => {
    const result = resultOfATestWith(assert => assert.isNotEmpty(['hey']));

    expectSuccess(result);
  });

  test('isEmpty passes on an empty set', () => {
    const result = resultOfATestWith(assert => assert.that(emptySet).isEmpty());

    expectSuccess(result);
  });

  test('isEmpty does not pass on a set with elements', () => {
    const result = resultOfATestWith(assert => assert.that(nonEmptySet).isEmpty());

    expectFailureOn(result, I18nMessage.of('expectation_be_empty', Utils.prettyPrint(nonEmptySet)));
  });

  test('isNotEmpty does not pass on an empty set', () => {
    const result = resultOfATestWith(assert => assert.that(emptySet).isNotEmpty());

    expectFailureOn(result, I18nMessage.of('expectation_be_not_empty', Utils.prettyPrint(emptySet)));
  });

  test('isNotEmpty passes on a set with elements', () => {
    const result = resultOfATestWith(assert => assert.that(nonEmptySet).isNotEmpty());

    expectSuccess(result);
  });

  test('isEmpty fails when the object is undefined', () => {
    const result = resultOfATestWith(assert => assert.isEmpty(undefined));

    expectFailureOn(result, I18nMessage.of('expectation_be_empty', 'undefined'));
  });

  test('isNotEmpty fails when the object is undefined', () => {
    const result = resultOfATestWith(assert => assert.isNotEmpty(undefined));

    expectFailureOn(result, I18nMessage.of('expectation_be_not_empty', 'undefined'));
  });

  test('includes works with Sets', () => {
    const result = resultOfATestWith(assert => assert.that(new Set([42])).includes(42));
  
    expectSuccess(result);
  });

  test('includes works with Maps', () => {
    const result = resultOfATestWith(assert => assert.that(new Map([['key', 42]])).includes(42));
  
    expectSuccess(result);
  });

  test('includes works with Strings', () => {
    const result = resultOfATestWith(assert => assert.that('42').includes('4'));
  
    expectSuccess(result);
  });

  test('doesNotInclude works with Sets', () => {
    const result = resultOfATestWith(assert => assert.that(new Set([24])).doesNotInclude(42));
  
    expectSuccess(result);
  });

  test('doesNotInclude works with Maps', () => {
    const result = resultOfATestWith(assert => assert.that(new Map([['key', 24]])).doesNotInclude(42));
  
    expectSuccess(result);
  });

  test('doesNotInclude works with Strings', () => {
    const result = resultOfATestWith(assert => assert.that('24').doesNotInclude('5'));
  
    expectSuccess(result);
  });
});
