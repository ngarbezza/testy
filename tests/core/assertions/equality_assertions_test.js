'use strict';

const { assert, suite, test } = require('../../../lib/testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectSuccess, expectFailureOn } = require('../../support/assertion_helpers');

const { I18nMessage, I18n } = require('../../../lib/i18n');

suite('equality assertions', () => {
  test('isEqualTo pass with equal primitive objects', async() => {
    const result = await resultOfATestWith(asserter => asserter.that(42).isEqualTo(42));

    expectSuccess(result);
  });

  test('isEqualTo fails with different primitive objects', async() => {
    const result = await resultOfATestWith(asserter => asserter.that(42).isEqualTo(21));

    expectFailureOn(result, I18nMessage.of('equality_assertion_be_equal_to', '42', '21'));
  });

  test('isEqualTo passes with boxed and unboxed numbers', async() => {
    const result = await resultOfATestWith(asserter => asserter.that(42).isEqualTo((42)));

    expectSuccess(result);
  });

  test('isEqualTo passes with arrays in the same order', async() => {
    const result = await resultOfATestWith(asserter => asserter.that([1, 2, 3]).isEqualTo([1, 2, 3]));

    expectSuccess(result);
  });

  test('isEqualTo fails with arrays in different order', async() => {
    const result = await resultOfATestWith(asserter => asserter.that([1, 2, 3]).isEqualTo([1, 3, 2]));

    expectFailureOn(result, I18nMessage.of('equality_assertion_be_equal_to', '[ 1, 2, 3 ]', '[ 1, 3, 2 ]'));
  });

  test('isEqualTo passes with objects having the same property values', async() => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    const objectTwo = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    /* eslint-enable id-length */
    const result = await resultOfATestWith(asserter => asserter.that(objectOne).isEqualTo(objectTwo));

    expectSuccess(result);
  });

  test('isEqualTo fails with objects having different property values', async() => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    const objectTwo = { a: 'a', b: { b1: 'b1', b2: '' } };
    /* eslint-enable id-length */
    const result = await resultOfATestWith(asserter => asserter.that(objectOne).isEqualTo(objectTwo));

    expectFailureOn(result, I18nMessage.of('equality_assertion_be_equal_to', "{ a: 'a', b: { b1: 'b1', b2: 'b2' } }", "{ a: 'a', b: { b1: 'b1', b2: '' } }"));
  });

  test('isEqualTo fails if one object has less properties than the other', async() => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b' };
    const objectTwo = { a: 'a', b: 'b', c: 'c' };
    /* eslint-enable id-length */
    const result = await resultOfATestWith(asserter => asserter.that(objectOne).isEqualTo(objectTwo));

    expectFailureOn(result, I18nMessage.of('equality_assertion_be_equal_to', "{ a: 'a', b: 'b' }", "{ a: 'a', b: 'b', c: 'c' }"));
  });

  test('isEqualTo fails if one object has more properties than the other', async() => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b', c: 'c' };
    const objectTwo = { a: 'a', b: 'b' };
    /* eslint-enable id-length */
    const result = await resultOfATestWith(asserter => asserter.that(objectOne).isEqualTo(objectTwo));

    expectFailureOn(result, I18nMessage.of('equality_assertion_be_equal_to', "{ a: 'a', b: 'b', c: 'c' }", "{ a: 'a', b: 'b' }"));
  });

  test('isEqualTo with custom criteria fails if objects do not have that property', async() => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b' };
    const objectTwo = { a: 'a', b: 'b' };
    /* eslint-enable id-length */
    const result = await resultOfATestWith(asserter => asserter.areEqual(objectOne, objectTwo, 'notFound'));

    const assertionMessage = I18nMessage.of('equality_assertion_be_equal_to', "{ a: 'a', b: 'b' }", "{ a: 'a', b: 'b' }");
    const additionalMessage = I18nMessage.of('equality_assertion_failed_due_to_missing_property', 'notFound');
    expectFailureOn(result, I18nMessage.joined([assertionMessage, additionalMessage], ' '));
  });

  test('isEqualTo with custom criteria passes if the criteria evaluates to true', async() => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b1', myEqualMessage: () => true };
    const objectTwo = { a: 'a', b: 'b2', myEqualMessage: () => true };
    /* eslint-enable id-length */
    const result = await resultOfATestWith(asserter => asserter.areEqual(objectOne, objectTwo, 'myEqualMessage'));

    expectSuccess(result);
  });

  test('isEqualTo with custom criteria passes if the criteria evaluates to true, and we are comparing instances of the same class', async() => {
    class AClass {
      constructor(asd) {
        this.asd = asd;
      }
      myEqualMessage() {
        return true;
      }
    }
    const objectOne = new AClass();
    const objectTwo = new AClass();
    const result = await resultOfATestWith(asserter => asserter.areEqual(objectOne, objectTwo, 'myEqualMessage'));

    expectSuccess(result);
  });

  test('isEqualTo with equals() default criteria passes if it evaluates to true, and we are comparing instances of the same class', async() => {
    class AClass {
      constructor(asd) {
        this.asd = asd;
      }
      equals() {
        return true;
      }
    }
    const objectOne = new AClass(1);
    const objectTwo = new AClass(2);
    const result = await resultOfATestWith(asserter => asserter.areEqual(objectOne, objectTwo));

    expectSuccess(result);
  });

  test('isEqualTo fails when comparing undefined with an object', async() => {
    const resultOne = await resultOfATestWith(asserter => asserter.areEqual(undefined, {}));
    const resultTwo = await resultOfATestWith(asserter => asserter.areEqual({}, undefined));

    expectFailureOn(resultOne, I18nMessage.of('equality_assertion_be_equal_to', 'undefined', '{}'));
    expectFailureOn(resultTwo, I18nMessage.of('equality_assertion_be_equal_to', '{}', 'undefined'));
  });

  test('isEqualTo fails when comparing null with an object', async() => {
    const resultOne = await resultOfATestWith(asserter => asserter.areEqual(null, {}));
    const resultTwo = await resultOfATestWith(asserter => asserter.areEqual({}, null));

    expectFailureOn(resultOne, I18nMessage.of('equality_assertion_be_equal_to', 'null', '{}'));
    expectFailureOn(resultTwo, I18nMessage.of('equality_assertion_be_equal_to', '{}', 'null'));
  });

  test('isEqualTo fails if both parts are undefined', async() => {
    const result = await resultOfATestWith(asserter => asserter.areEqual(undefined, undefined));
    expectFailureOn(result, I18nMessage.of('equality_assertion_failed_due_to_undetermination'));
  });

  test('isEqualTo fails with object with circular references', async() => {
    const objectOne = { toString() {
      return 'circular!';
    } };
    objectOne.self = objectOne;
    const result = await resultOfATestWith(asserter => asserter.areEqual(objectOne, objectOne));

    const assertionMessage = I18nMessage.of('equality_assertion_be_equal_to', 'circular!', 'circular!');
    const additionalMessage = I18nMessage.of('equality_assertion_failed_due_to_circular_references');
    expectFailureOn(result, I18nMessage.joined([assertionMessage, additionalMessage], ' '));
  });

  test('isNotEqualTo fails if both parts are undefined', async() => {
    const result = await resultOfATestWith(asserter => asserter.that(undefined).isNotEqualTo(undefined));
    expectFailureOn(result, I18nMessage.of('equality_assertion_failed_due_to_undetermination'));
  });

  test('displays equality failure messages with all depth', async() => {
    const result = await resultOfATestWith(asserter => asserter.that({ a1: { a2: { a3: { a4: true } } } }).isEqualTo({ a1: { a2: { a3: { a4: false } } } }));
    const actualFailureMessageInEnglish = result.failureMessage().expressedIn(I18n.default());
    assert.that(actualFailureMessageInEnglish).isEqualTo('Expected { a1: { a2: { a3: { a4: true } } } } to be equal to { a1: { a2: { a3: { a4: false } } } }');
  });
});
