
/**
 * Namespace extension for the suite function
 */
export namespace suite { // ESTO deberia quedar igual que la clase Test.
    /**
     * Define a test suite that will be skipped
     */
    export function skip(name: string, body: () => void): void;

    /**
     * Define a test suite that will be the only one executed
     */
    export function only(name: string, body: () => void): void;
}