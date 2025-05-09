import { assert, suite, test } from '../../lib/testy.js';
import {
  isCyclic,
  deepStrictEqual,
  prettyPrint,
  isBoolean,
  isNumber,
  isString,
  isStringWithContent,
  isFunction,
  isUndefined,
  isRegex,
  notNullOrUndefined,
  respondsTo,
  isEmpty,
  shuffle,
  numberOfElements,
  convertToArray,
  asFloat,
  resolvePathFor,
  allFilesMatching,
  subclassResponsibility,
  errorDetailOf,
  detectUserCallingLocation,
  classNameOf,
} from '../../lib/utils/index.js';

suite('utils index', () => {
  test('index exports all utility functions', () => {
    // Test that all functions are exported
    assert.that(isCyclic).isNotUndefined();
    assert.that(deepStrictEqual).isNotUndefined();
    assert.that(prettyPrint).isNotUndefined();
    assert.that(isBoolean).isNotUndefined();
    assert.that(isNumber).isNotUndefined();
    assert.that(isString).isNotUndefined();
    assert.that(isStringWithContent).isNotUndefined();
    assert.that(isFunction).isNotUndefined();
    assert.that(isUndefined).isNotUndefined();
    assert.that(isRegex).isNotUndefined();
    assert.that(notNullOrUndefined).isNotUndefined();
    assert.that(respondsTo).isNotUndefined();
    assert.that(isEmpty).isNotUndefined();
    assert.that(shuffle).isNotUndefined();
    assert.that(numberOfElements).isNotUndefined();
    assert.that(convertToArray).isNotUndefined();
    assert.that(asFloat).isNotUndefined();
    assert.that(resolvePathFor).isNotUndefined();
    assert.that(allFilesMatching).isNotUndefined();
    assert.that(subclassResponsibility).isNotUndefined();
    assert.that(errorDetailOf).isNotUndefined();
    assert.that(detectUserCallingLocation).isNotUndefined();
    assert.that(classNameOf).isNotUndefined();
  });
});
