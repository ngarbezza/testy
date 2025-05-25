/**
 * I am an executable test, part of a test suite and executed by a test runner.
 * After the execution, I know the result. Tests must contain at least one assertion.
 */
export class Test {
    /**
     * Mark the test to be skipped
     */
    skip(): void;

    /**
     * Mark the test to be the only one run
     */
    only(): void;
}