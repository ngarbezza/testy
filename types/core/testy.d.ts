import {Test} from "./test";
import {Asserter} from "./asserter";
import {FailureGenerator, PendingMarker} from "./testResultReporter";

export namespace testy {
    /**
     * Defines a new test. Each test belongs to a test suite and defines assertions in the body.
     *
     * For info about assertions, take a look at the assert object.
     *
     * Tests are represented internally as instances of Test.
     *
     * @example
     * test('arithmetic works', () => {
     *   assert.areEqual(3 + 4, 7);
     * });
     *
     * @param name - How you would like to call the test. Non-empty string.
     * @param testBody - The test definition, written as a zero-argument function.
     * @returns A Test instance
     */
    export function test(name: string, testBody: () => void | Promise<void>): Test;

    /**
     * Define a test suite that groups related tests
     *
     * @param name - The name of the suite
     * @param body - The suite definition function containing tests
     */
    export function suite(name: string, body: () => void): void;

    /**
     * Assertions that can be used in tests
     */

    export const assert: Asserter

    export const pending: PendingMarker

    export const fail: FailureGenerator

    /**
     * Run the given function before each test in the current suite
     */
    export function before(body: () => void | Promise<void>)

    /**
     * Run the given function after each test in the current suite
     */
    export function after(body: () => void | Promise<void>)

}

export * from './test';
export * from './testResultReporter';
export * from './suite';
export * from './asserter';
export * from './assertion';
// crear un proyecto cualquiera TS, instalarle Testy (el que tengo en mi compu). En el package.json se puede poner una ruta a una dependencia local
// ver si los JSDoc estan disponibles sin poner las descripciones en los .d.ts. Lograr en lo posible que solo queden en los .js
