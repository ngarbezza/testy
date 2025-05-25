type EqualityCriteria = string | ((x: any, y: any) => boolean)
export class Assertion {
    /**
     * Expects the actual object to be strictly equal to `true`. Other "truthy" values according to Javascript rules
     * will be considered not true.
     * Another way of writing this assertion is to use the [isTrue]{@link Asserter#isTrue} method.
     *
     * @example
     * assert.that(3 < 4).isTrue()
     *
     * @example equivalent version
     * assert.isTrue(3 < 4)
     *
     * @returns {void}
     */
    isTrue(): void;

    /**
     * Expects the actual object to be strictly equal to `false`. Other "falsy" values according to Javascript rules
     * will be considered not false.
     * Another way of writing this assertion is to use the [isFalse]{@link Asserter#isFalse} method.
     *
     * @example
     * assert.that(3 >= 4).isFalse()
     *
     * @example equivalent version
     * assert.isFalse(3 >= 4)
     *
     * @returns {void}
     */
    isFalse(): void;

    /**
     * Expects the actual object to be strictly equal to `undefined`.
     * Another way of writing this assertion is to use the [isUndefined]{@link Asserter#isUndefined} method.
     *
     * @example
     * assert.that(object.missingProperty).isUndefined()
     *
     * @example equivalent version
     * assert.isUndefined(object.missingProperty)
     *
     * @returns {void}
     */
    isUndefined(): void;

    /**
     * Expects the actual object to be not strictly equal to `undefined`.
     * Another way of writing this assertion is to use the [isNotUndefined]{@link Asserter#isNotUndefined} method.
     *
     * @example
     * assert.that("hello".length).isNotUndefined()
     *
     * @example equivalent version
     * assert.isNotUndefined("hello".length)
     *
     * @returns {void}
     */
    isNotUndefined(): void;


    /**
     * Expects the actual object to be strictly equal to `null`.
     * Another way of writing this assertion is to use the [isNull]{@link Asserter#isNull} method.
     *
     * @example
     * assert.that(null).isNull()
     *
     * @example equivalent version
     * assert.isNull(null)
     *
     * @returns {void}
     */
    isNull(): void

    /**
     * Expects the actual object to be different from `null`.
     * Another way of writing this assertion is to use the [isNotNull]{@link Asserter#isNotNull} method.
     *
     * @example
     * assert.that('something').isNotNull()
     *
     * @example equivalent version
     * assert.isNotNull('something')
     *
     * @returns {void}
     */
    isNotNull(): void

    /**
     * Expects the actual object to be equal to an expected object, according to a default or custom criteria.
     * Another way of writing this assertion is to use the {@link areEqual} method.
     *
     * @example
     * assert.that('3' + '4').isEqualTo('34')
     *
     * @example equivalent version
     * assert.areEqual(3 + 4, 7)
     *
     * @example custom criteria
     * assert.that([2, 3]).isEqualTo(['x', 'y'], (a, b) => a.length === b.length)
     *
     * @param {*} expected the object that you are expecting the `actual` to be.
     * @param {Function} [criteria] a two-argument function to be used to compare `actual` and `expected`. Optional.
     *
     * @returns {void}
     */
    isEqualTo(expected: any, criteria?: EqualityCriteria): void

    /**
     * Expects the actual object to be not equal to an expected object, according to a default or custom criteria.
     * Another way of writing this assertion is to use the {@link areNotEqual} method.
     *
     * @example
     * assert.that('3' + '4').isNotEqualTo('7')
     *
     * @example equivalent version
     * assert.areNotEqual(3 + 4, 8)
     *
     * @example custom criteria
     * assert.that([2, 3]).isNotEqualTo(['x'], (a, b) => a.length === b.length)
     *
     * @param {*} expected the object that you are expecting the `actual` to be not equal.
     * @param {Function} [criteria] a two-argument function to be used to compare `actual` and `expected`. Optional.
     *
     * @returns {void}
     */
    isNotEqualTo(expected: any, criteria: EqualityCriteria): void

    /**
     * Expects the actual object to be identical (be the same reference) to an expected one.
     * Another way of writing this assertion is to use the {@link areIdentical} method.
     *
     * @example literals
     * assert.that(3).isIdenticalTo(3)
     *
     * @example equivalent version
     * assert.areIdentical(3, 3)
     *
     * @example same reference
     * const object = { my: "object" }
     * assert.that(object).isIdenticalTo(object)
     *
     * @param {*} expected the object that you are expecting the `actual` to be.
     *
     * @returns {void}
     */
    isIdenticalTo(expected: any): void

    /**
     * Expects the actual object not to be identical (be the same reference) to an expected one.
     * Another way of writing this assertion is to use the {@link areIdentical} method.
     *
     * @example literals
     * assert.that(3).isIdenticalTo(3)
     *
     * @example equivalent version
     * assert.areIdentical(3, 3)
     *
     * @example same reference
     * const object = { my: "object" }
     * assert.that(object).isIdenticalTo(object)
     *
     * @param {*} expected the object that you are expecting the `actual` to be.
     *
     * @returns {void}
     */
    isNotIdenticalTo(expected: any): void

    /**
     * Expects the actual collection object to include an expected object. Works for Array, Strings, Set and Maps.
     * It works in the same way as {@link isIncludedIn} but swapping actual and expected objects.
     *
     * @example array
     * assert.that([1, 2, 3]).includes(2)
     *
     * @example set
     * assert.that(new Set([1, 2, 3])).includes(3)
     *
     * @example string
     * assert.that('42').includes('4')
     *
     * @param {*} expectedObject the object that you are expecting to be included.
     * @param {Function} [equalityCriteria] a two-argument function to be used to compare elements from the `actual` collection and `expectedObject`. Optional.
     *
     * @returns {void}
     */
    includes(expectedObject: any, equalityCriteria?: EqualityCriteria): void

    /**
     * Expects the actual collection object not to include an expected object. Works for Array, Strings, Set and Maps.
     * It works in the same way as {@link isNotIncludedIn} but swapping actual and expected objects.
     *
     * @example array
     * assert.that([1, 2, 3]).includes(2)
     *
     * @example set
     * assert.that(new Set([1, 2, 3])).includes(3)
     *
     * @example string
     * assert.that('42').includes('4')
     *
     * @param {*} expectedObject the object that you are expecting not to be included.
     * @param {Function} [equalityCriteria] a two-argument function to be used to compare elements from the `actual` collection and `expectedObject`. Optional.
     *
     * @returns {void}
     */
    doesNotInclude(expectedObject: any, equalityCriteria?: EqualityCriteria): void

    /**
     * Expects the actual object to be included on an expected collection. Works for Array, Strings, Set and Maps.
     * It works in the same way as {@link includes} but swapping actual and expected objects.
     *
     * @example array
     * assert.that(2).isIncludedIn([1, 2, 3])
     *
     * @example set
     * assert.that(3).isIncludedIn(new Set([1, 2, 3]))
     *
     * @example string
     * assert.that('lo').isIncludedIn('hello')
     *
     * @param {*} expectedCollection the collection that you are expecting the `actual` to be included in.
     * @param {Function} [equalityCriteria] a two-argument function to be used to compare elements from the `expectedCollection` and your `actual` object. Optional.
     *
     * @returns {void}
     */
    isIncludedIn(expectedCollection: any[] | string | Set<any> | Map<any, any>, equalityCriteria?: EqualityCriteria): void

    /**
     * Expects the actual object not to be included on an expected collection. Works for Array, Strings, Set and Maps.
     * It works in the same way as {@link doesNotInclude} but swapping actual and expected objects.
     *
     * @example array
     * assert.that(2).isIncludedIn([1, 2, 3])
     *
     * @example set
     * assert.that(3).isIncludedIn(new Set([1, 2, 3]))
     *
     * @example string
     * assert.that('lo').isIncludedIn('hello')
     *
     * @param {*} expectedCollection the collection that you are expecting the `actual` to be included in.
     * @param {Function} [equalityCriteria] a two-argument function to be used to compare elements from the `expectedCollection` and your `actual` object. Optional.
     *
     * @returns {void}
     */
    isNotIncludedIn(expectedCollection: any[] | string | Set<any> | Map<any, any>, equalityCriteria?: EqualityCriteria): void

    /**
     * Expects the actual object to include all the pass in objects no matter the order. Works for Array and Set.
     *
     * @example array
     * assert.that(['hey']).includesExactly('hey')
     *
     * @example set
     * assert.that(new Set(['hey', 'ho'])).includesExactly('ho', 'hey')
     *
     *
     * @param {any[]} objects all the objects that are expected to be part of the actual collection.
     *
     * @returns {void}
     */
    includesExactly(...objects: any[]): void

    /**
     * Expects the actual object to be an empty collection (arrays, strings, sets and maps).
     * Another way of writing this assertion is to use the [isEmpty]{@link Asserter#isEmpty} method.
     *
     * @example
     * assert.that([]).isEmpty()
     * assert.that('').isEmpty()
     * assert.that(new Set()).isEmpty()
     * assert.that(new Map()).isEmpty()
     *
     * @example equivalent version
     * assert.isEmpty('')
     *
     * @returns {void}
     */
    isEmpty(): void

    /**
     * Expects the actual object to be a non-empty collection (arrays, strings, sets and maps).
     * Another way of writing this assertion is to use the [isNotEmpty]{@link Asserter#isNotEmpty} method.
     *
     * @example
     * assert.that([42]).isNotEmpty()
     * assert.that('hello').isNotEmpty()
     * assert.that(new Set([42])).isNotEmpty()
     * assert.that(new Map([['key', 42]])).isNotEmpty()
     *
     * @example equivalent version
     * assert.isNotEmpty('hello')
     *
     * @returns {void}
     */
    isNotEmpty(): void

    /**
     * Expects the actual object (in this case, a function) to raise an exception that matches the given expectation.
     *
     * @example exact error object
     * assert.that(() => throw new Error("oops")).raises(new Error("oops"))
     *
     * @example regular expression
     * assert.that(() => throw new Error("oops I did it again")).raises(/oops/)
     *
     * @param {any|RegExp} errorExpectation the error object expected to be thrown or a Regex that matches with the actual error message.
     *
     * @returns {void}
     */
    raises(errorExpectation: any): void

    /**
     * Expects the actual object (in this case, a function) to not raise an exception that matches the given criteria.
     *
     * @example exact error object
     * assert.that(() => throw new Error("oops")).doesNotRaise(new Error("ay!"))
     *
     * @example regular expression
     * assert.that(() => throw new Error("oops")).doesNotRaise(/ay/)
     *
     * @param {any|RegExp} notExpectedError the error object expected not to be thrown or a Regex that should not match
     * with the actual error message.
     *
     * @returns {void}
     */
    doesNotRaise(notExpectedError: any): void

    /**
     * Expects the actual object (in this case, a function) to not raise any exception at all.
     * This is the most accurate way to ensure that a piece of code does not fail.
     *
     * @example
     * assert.that(() => 42).doesNotRaiseAnyErrors()
     *
     * @returns {void}
     */
    doesNotRaiseAnyErrors(): void

    isNearTo(number: number, precisionDigits?: number): void

    /**
     * Expects the actual object (in this case, a number) to be strictly greater than the given one.
     *
     * @example
     * assert.that(4).isGreaterThan(3)
     *
     * @param {Number} number number to compare against the actual value.
     * @returns {void}
     */
    isGreaterThan(number: number): void

    /**
     * Expects the actual object (in this case, a number) to be greater or equal than the given one.
     *
     * @example
     * assert.that(4).isGreaterThanOrEqualTo(4)
     *
     * @param {Number} number number to compare against the actual value.
     * @returns {void}
     */
    isGreaterThanOrEqualTo(number: number): void
    /**
     * Expects the actual object (in this case, a number) to be strictly less than the given one.
     *
     * @example
     * assert.that(3).isLessThan(4)
     *
     * @param {Number} number number to compare against the actual value.
     * @returns {void}
     */
    isLessThan(number: number): void

    /**
     * Expects the actual object (in this case, a number) to be less or equal than the given one.
     *
     * @example
     * assert.that(4).isLessThanOrEqualTo(4)
     *
     * @param {Number} number number to compare against the actual value.
     * @returns {void}
     */
    isLessThanOrEqualTo(number: number): void

    /**
     * Expects actual object to match a given regexp.
     *
     * @example
     * assert.that('hello').matches('hello', /[a-z]+/)
     *
     * @example equivalent version
     * assert.that('hello').matches(/ll/)
     *
     * @param {string | RegExp} regex the regexp you will use to parse the actual object.
     *
     * @returns {void}
     */
    matches(regex: string | RegExp): void
}