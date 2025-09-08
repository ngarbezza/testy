import { assert, suite, test } from '../../../lib/testy.js';
import { resultOfATestWith } from '../../support/runner_helpers.js';
import { expectFailureOn, expectSuccess } from '../../support/assertion_helpers.js';

import { I18n } from '../../../lib/i18n/i18n.js';
import { I18nMessage } from '../../../lib/i18n/i18n_messages.js';

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

  test('isNotEqualTo passes when custom criteria evaluates to not equal', async() => {
    const criteria = (_a, _b) => false;
    const result = await resultOfATestWith(asserter =>
      asserter.areNotEqual({ abc: 123, def: 456 }, { abc: 123, def: 456 }, criteria),
    );
    expectSuccess(result);
  });

  test('isNotEqualTo fails and displays an error message properly formatted', async() => {
    const result = await resultOfATestWith(asserter => asserter.areNotEqual({ abc: '123' }, { abc: '123' }));
    const actualFailureMessageInEnglish = result.failureMessage().expressedIn(I18n.default());
    assert.that(result.isFailure()).isTrue();
    assert.that(actualFailureMessageInEnglish).isEqualTo('Expected { abc: \'123\' } to be not equal to { abc: \'123\' }');
  });

  test('displays equality failure messages with all depth', async() => {
    const result = await resultOfATestWith(asserter => asserter.that({ a1: { a2: { a3: { a4: true } } } }).isEqualTo({ a1: { a2: { a3: { a4: false } } } }));
    const actualFailureMessageInEnglish = result.failureMessage().expressedIn(I18n.default());
    assert.that(result.isFailure()).isTrue();
    assert.that(actualFailureMessageInEnglish).isEqualTo('Expected { a1: { a2: { a3: { a4: true } } } } to be equal to { a1: { a2: { a3: { a4: false } } } }');
  });

  // Additional comprehensive tests for isNotEqualTo

  test('isNotEqualTo passes with different primitive objects', async() => {
    const result = await resultOfATestWith(asserter => asserter.that(42).isNotEqualTo(21));

    expectSuccess(result);
  });

  test('isNotEqualTo fails with equal primitive objects', async() => {
    const result = await resultOfATestWith(asserter => asserter.that(42).isNotEqualTo(42));

    expectFailureOn(result, I18nMessage.of('equality_assertion_be_not_equal_to', '42', '42'));
  });

  test('isNotEqualTo fails with boxed and unboxed numbers', async() => {
    const result = await resultOfATestWith(asserter => asserter.that(42).isNotEqualTo((42)));

    expectFailureOn(result, I18nMessage.of('equality_assertion_be_not_equal_to', '42', '42'));
  });

  test('isNotEqualTo fails with arrays in the same order', async() => {
    const result = await resultOfATestWith(asserter => asserter.that([1, 2, 3]).isNotEqualTo([1, 2, 3]));

    expectFailureOn(result, I18nMessage.of('equality_assertion_be_not_equal_to', '[ 1, 2, 3 ]', '[ 1, 2, 3 ]'));
  });

  test('isNotEqualTo passes with arrays in different order', async() => {
    const result = await resultOfATestWith(asserter => asserter.that([1, 2, 3]).isNotEqualTo([1, 3, 2]));

    expectSuccess(result);
  });

  test('isNotEqualTo fails with objects having the same property values', async() => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    const objectTwo = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    /* eslint-enable id-length */
    const result = await resultOfATestWith(asserter => asserter.that(objectOne).isNotEqualTo(objectTwo));

    expectFailureOn(result, I18nMessage.of('equality_assertion_be_not_equal_to', "{ a: 'a', b: { b1: 'b1', b2: 'b2' } }", "{ a: 'a', b: { b1: 'b1', b2: 'b2' } }"));
  });

  test('isNotEqualTo passes with objects having different property values', async() => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    const objectTwo = { a: 'a', b: { b1: 'b1', b2: '' } };
    /* eslint-enable id-length */
    const result = await resultOfATestWith(asserter => asserter.that(objectOne).isNotEqualTo(objectTwo));

    expectSuccess(result);
  });

  test('isNotEqualTo passes if one object has less properties than the other', async() => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b' };
    const objectTwo = { a: 'a', b: 'b', c: 'c' };
    /* eslint-enable id-length */
    const result = await resultOfATestWith(asserter => asserter.that(objectOne).isNotEqualTo(objectTwo));

    expectSuccess(result);
  });

  test('isNotEqualTo passes if one object has more properties than the other', async() => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b', c: 'c' };
    const objectTwo = { a: 'a', b: 'b' };
    /* eslint-enable id-length */
    const result = await resultOfATestWith(asserter => asserter.that(objectOne).isNotEqualTo(objectTwo));

    expectSuccess(result);
  });

  test('isNotEqualTo with custom criteria passes if objects do not have that property', async() => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b' };
    const objectTwo = { a: 'a', b: 'b' };
    /* eslint-enable id-length */
    const result = await resultOfATestWith(asserter => asserter.areNotEqual(objectOne, objectTwo, 'notFound'));

    // When custom criteria property is missing, equality comparison fails,
    // so objects are considered "not equal" and isNotEqualTo succeeds
    expectSuccess(result);
  });

  test('isNotEqualTo with custom criteria fails if the criteria evaluates to true', async() => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b1', myEqualMessage: () => true };
    const objectTwo = { a: 'a', b: 'b2', myEqualMessage: () => true };
    /* eslint-enable id-length */
    const result = await resultOfATestWith(asserter => asserter.areNotEqual(objectOne, objectTwo, 'myEqualMessage'));

    expectFailureOn(result, I18nMessage.of('equality_assertion_be_not_equal_to', "{ a: 'a', b: 'b1', myEqualMessage: [Function: myEqualMessage] }", "{ a: 'a', b: 'b2', myEqualMessage: [Function: myEqualMessage] }"));
  });

  test('isNotEqualTo with custom criteria fails if the criteria evaluates to true, and we are comparing instances of the same class', async() => {
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
    const result = await resultOfATestWith(asserter => asserter.areNotEqual(objectOne, objectTwo, 'myEqualMessage'));

    expectFailureOn(result, I18nMessage.of('equality_assertion_be_not_equal_to', 'AClass { asd: undefined }', 'AClass { asd: undefined }'));
  });

  test('isNotEqualTo with equals() default criteria fails if it evaluates to true, and we are comparing instances of the same class', async() => {
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
    const result = await resultOfATestWith(asserter => asserter.areNotEqual(objectOne, objectTwo));

    expectFailureOn(result, I18nMessage.of('equality_assertion_be_not_equal_to', 'AClass { asd: 1 }', 'AClass { asd: 2 }'));
  });

  test('isNotEqualTo passes when comparing undefined with an object', async() => {
    const resultOne = await resultOfATestWith(asserter => asserter.areNotEqual(undefined, {}));
    const resultTwo = await resultOfATestWith(asserter => asserter.areNotEqual({}, undefined));

    expectSuccess(resultOne);
    expectSuccess(resultTwo);
  });

  test('isNotEqualTo passes when comparing null with an object', async() => {
    const resultOne = await resultOfATestWith(asserter => asserter.areNotEqual(null, {}));
    const resultTwo = await resultOfATestWith(asserter => asserter.areNotEqual({}, null));

    expectSuccess(resultOne);
    expectSuccess(resultTwo);
  });

  test('isNotEqualTo passes with object with circular references when comparing different objects', async() => {
    const objectOne = { toString() {
      return 'circular1!';
    } };
    objectOne.self = objectOne;
    const objectTwo = { toString() {
      return 'circular2!';
    } };
    objectTwo.self = objectTwo;
    const result = await resultOfATestWith(asserter => asserter.areNotEqual(objectOne, objectTwo));

    // Different circular objects should be considered not equal, so isNotEqualTo should succeed
    expectSuccess(result);
  });

  test('isNotEqualTo succeeds with same object with circular references', async() => {
    const objectOne = { toString() {
      return 'circular!';
    } };
    objectOne.self = objectOne;
    const result = await resultOfATestWith(asserter => asserter.areNotEqual(objectOne, objectOne));

    // Even though it's the same object, circular reference detection treats them as "not equal"
    // so isNotEqualTo succeeds
    expectSuccess(result);
  });
});
