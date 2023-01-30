'use strict';

import { suite, test } from '../../../lib/testy.js';
import { resultOfATestWith } from '../../support/runner_helpers.js';
import { expectFailureOn, expectSuccess } from '../../support/assertion_helpers.js';

import { prettyPrint } from '../../../lib/utils.js';
import { I18nMessage } from '../../../lib/i18n/i18n.js';

suite('collection assertions', () => {
  const nonEmptySet = new Set([1]);
  const emptySet = new Set([]);

  // includes() assertion tests

  test('includes passes if the object is in the array', async() => {
    const result = await resultOfATestWith(assert => assert.that(['hey']).includes('hey'));

    expectSuccess(result);
  });

  test('includes does not pass if the actual object is not an array', async() => {
    const result = await resultOfATestWith(assert => assert.that([]).includes('hey'));

    expectFailureOn(result, I18nMessage.of('expectation_include', '[]', "'hey'"));
  });

  test('includes works with non-primitives', async() => {
    const result = await resultOfATestWith(assert => assert.that([{ asd: '1' }]).includes({ asd: '1' }));

    expectSuccess(result);
  });

  test('includes works with Sets', async() => {
    const result = await resultOfATestWith(assert => assert.that(new Set([42])).includes(42));

    expectSuccess(result);
  });

  test('includes works with Maps', async() => {
    const result = await resultOfATestWith(assert => assert.that(new Map([['key', 42]])).includes(42));

    expectSuccess(result);
  });

  test('includes works with Strings', async() => {
    const result = await resultOfATestWith(assert => assert.that('42').includes('4'));

    expectSuccess(result);
  });

  // doesNotInclude() assertion tests

  test('doesNotInclude fails if the object is in the array', async() => {
    const result = await resultOfATestWith(assert => assert.that(['hey']).doesNotInclude('hey'));

    expectFailureOn(result, I18nMessage.of('expectation_not_include', "[ 'hey' ]", "'hey'"));
  });

  test('doesNotInclude passes if the object is not an array', async() => {
    const result = await resultOfATestWith(assert => assert.that([]).doesNotInclude('hey'));

    expectSuccess(result);
  });

  test('doesNotInclude fails properly with non-primitives', async() => {
    const result = await resultOfATestWith(assert => assert.that([{ asd: '1' }]).doesNotInclude({ asd: '1' }));

    expectFailureOn(result, I18nMessage.of('expectation_not_include', "[ { asd: '1' } ]", "{ asd: '1' }"));
  });

  test('doesNotInclude works with Sets', async() => {
    const result = await resultOfATestWith(assert => assert.that(new Set([24])).doesNotInclude(42));

    expectSuccess(result);
  });

  test('doesNotInclude works with Maps', async() => {
    const result = await resultOfATestWith(assert => assert.that(new Map([['key', 24]])).doesNotInclude(42));

    expectSuccess(result);
  });

  test('doesNotInclude works with Strings', async() => {
    const result = await resultOfATestWith(assert => assert.that('24').doesNotInclude('5'));

    expectSuccess(result);
  });

  // includesExactly() assertion tests

  test('includesExactly passes with a single object included', async() => {
    const result = await resultOfATestWith(assert => assert.that(['hey']).includesExactly('hey'));

    expectSuccess(result);
  });

  test('includesExactly passes using a non-primitive single object', async() => {
    const result = await resultOfATestWith(assert => assert.that([{ asd: '1' }]).includesExactly({ asd: '1' }));

    expectSuccess(result);
  });

  test('includesExactly fails if the collection has more objects than expected', async() => {
    const result = await resultOfATestWith(assert => assert.that(['hey', 'ho']).includesExactly('hey'));

    expectFailureOn(result, I18nMessage.of('expectation_include_exactly', "[ 'hey', 'ho' ]", "[ 'hey' ]"));
  });

  test('includesExactly fails if the collection has less objects than expected', async() => {
    const result = await resultOfATestWith(assert => assert.that(['hey']).includesExactly('hey', 'ho'));

    expectFailureOn(result, I18nMessage.of('expectation_include_exactly', "[ 'hey' ]", "[ 'hey', 'ho' ]"));
  });

  test('includesExactly fails if none of the objects are included at all', async() => {
    const result = await resultOfATestWith(assert => assert.that(['hey']).includesExactly('ho'));

    expectFailureOn(result, I18nMessage.of('expectation_include_exactly', "[ 'hey' ]", "[ 'ho' ]"));
  });

  test('includesExactly passes with many items no matter the order', async() => {
    const result = await resultOfATestWith(assert => assert.that(['hey', 'ho']).includesExactly('ho', 'hey'));

    expectSuccess(result);
  });

  test('includesExactly passes on a Set', async() => {
    const result = await resultOfATestWith(assert => assert.that(new Set(['hey', 'ho'])).includesExactly('ho', 'hey'));

    expectSuccess(result);
  });

  // isEmpty() assertion tests

  test('isEmpty passes on an empty array', async() => {
    const result = await resultOfATestWith(assert => assert.that([]).isEmpty());

    expectSuccess(result);
  });

  test('isEmpty does not pass if the array has elements', async() => {
    const result = await resultOfATestWith(assert => assert.that(['hey']).isEmpty());

    expectFailureOn(result, I18nMessage.of('expectation_be_empty', "[ 'hey' ]"));
  });

  test('isEmpty passes with an empty string', async() => {
    const result = await resultOfATestWith(assert => assert.that('').isEmpty());

    expectSuccess(result);
  });

  test('isEmpty shorthand works', async() => {
    const result = await resultOfATestWith(assert => assert.isEmpty([]));

    expectSuccess(result);
  });

  test('isEmpty passes on an empty set', async() => {
    const result = await resultOfATestWith(assert => assert.that(emptySet).isEmpty());

    expectSuccess(result);
  });

  test('isEmpty does not pass on a set with elements', async() => {
    const result = await resultOfATestWith(assert => assert.that(nonEmptySet).isEmpty());

    expectFailureOn(result, I18nMessage.of('expectation_be_empty', prettyPrint(nonEmptySet)));
  });

  test('isEmpty fails when the object is undefined', async() => {
    const result = await resultOfATestWith(assert => assert.isEmpty(undefined));

    expectFailureOn(result, I18nMessage.of('expectation_be_empty', 'undefined'));
  });

  // isNotEmpty() assertion tests

  test('isNotEmpty passes on an array with element', async() => {
    const result = await resultOfATestWith(assert => assert.that(['hey']).isNotEmpty());

    expectSuccess(result);
  });

  test('isNotEmpty does not pass if the array is empty', async() => {
    const result = await resultOfATestWith(assert => assert.that([]).isNotEmpty());

    expectFailureOn(result, I18nMessage.of('expectation_be_not_empty', '[]'));
  });

  test('isNotEmpty passes with a string with content', async() => {
    const result = await resultOfATestWith(assert => assert.that('hey').isNotEmpty());

    expectSuccess(result);
  });

  test('isNotEmpty shorthand works', async() => {
    const result = await resultOfATestWith(assert => assert.isNotEmpty(['hey']));

    expectSuccess(result);
  });

  test('isNotEmpty does not pass on an empty set', async() => {
    const result = await resultOfATestWith(assert => assert.that(emptySet).isNotEmpty());

    expectFailureOn(result, I18nMessage.of('expectation_be_not_empty', prettyPrint(emptySet)));
  });

  test('isNotEmpty passes on a set with elements', async() => {
    const result = await resultOfATestWith(assert => assert.that(nonEmptySet).isNotEmpty());

    expectSuccess(result);
  });

  test('isNotEmpty fails when the object is undefined', async() => {
    const result = await resultOfATestWith(assert => assert.isNotEmpty(undefined));

    expectFailureOn(result, I18nMessage.of('expectation_be_not_empty', 'undefined'));
  });

  // isIncludedIn() assertion tests

  test('isIncludedIn is successful when the actual object is part of the expected list', async() => {
    const result = await resultOfATestWith(assert => assert.that(1).isIncludedIn([1, 2, 3]));

    expectSuccess(result);
  });

  test('isIncludedIn fails when the actual object is not part of the expected list', async() => {
    const result = await resultOfATestWith(assert => assert.that('hey').isIncludedIn([1, 2, 3]));

    expectFailureOn(result, I18nMessage.of('expectation_be_included_in', "'hey'", '[ 1, 2, 3 ]'));
  });

  // isNotIncludedIn() assertion tests

  test('isNotIncludedIn is successful when the actual object is not part of the expected list', async() => {
    const result = await resultOfATestWith(assert => assert.that('hey').isNotIncludedIn([1, 2, 3]));

    expectSuccess(result);
  });

  test('isNotIncludedIn fails when the actual object is part of the expected list', async() => {
    const result = await resultOfATestWith(assert => assert.that(1).isNotIncludedIn([1, 2, 3]));

    expectFailureOn(result, I18nMessage.of('expectation_be_not_included_in', '1', '[ 1, 2, 3 ]'));
  });
});
