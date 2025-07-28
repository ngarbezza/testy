/**
 * I represent a grouping of [tests]{@link Test} under a name, that will be executed by a
 * [runner]{@link TestRunner}. I can run some code [before]{@link TestSuite#before} and
 * [after]{@link TestSuite#after} each test.
 */
export class TestSuite {
    skip(): void;
}
