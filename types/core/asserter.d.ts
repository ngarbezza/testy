import {Assertion} from "./assertion";

export interface Asserter {
    /**
     * Assert that two values are equal
     */
    areEqual(actual: any, expected: any, message?: string): void;

    /**
     * Assert that two values are not equal
     */
    areNotEqual(actual: any, expected: any, message?: string): void;

    /**
     * Assert that a condition is true
     */
    isTrue(condition: boolean, message?: string): void;

    /**
     * Assert that a condition is false
     */
    isFalse(condition: boolean, message?: string): void;

    /**
     * Assert that a value is defined (not undefined)
     */
    isDefined(actual: any, message?: string): void;

    /**
     * Assert that a value is undefined
     */
    isUndefined(actual: any, message?: string): void;

    /**
     * Assert that a value is null
     */
    isNull(actual: any, message?: string): void;

    /**
     * Assert that a value is not null
     */
    isNotNull(actual: any, message?: string): void;

    /**
     * Explicitly mark a test as pending
     */
    pending(message?: string): void;

    /**
     * Make the test fail
     */
    fail(message?: string): void;

    /**
     * Assert that running a function throws an error
     */
    that(fn: () => void): Assertion

    /**
     * Sets a description for the assertion
     */
    withDescription(description: string): DescribedAsserter
}

export interface DescribedAsserter extends Asserter {
    customDescription(): string
}
