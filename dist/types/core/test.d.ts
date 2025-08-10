/**
 * I am an executable test, part of a [test suite]{@link TestSuite} and executed by a [test runner]{@link TestRunner}.
 * After the execution, I know the [result]{@link TestResult}. Tests must contain at least one assertion.
 * See {@link Asserter} and {@link Assertion} for more details on how to write those.
 */
export class Test {
    skip(): void;
    only(): void;
}
