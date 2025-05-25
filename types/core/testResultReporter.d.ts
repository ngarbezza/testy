/**
 * I report failures to the [test runner]{@link TestRunner}. The type of failures I report are not from failed
 * assertions, but user explicit requests for failures.
 */
export interface FailureGenerator  {
    /**
     * Makes the current test to explicitly fail, indicating an exceptional scenario.
     *
     * @example
     * fail.with('The code should not reach this point')
     *
     * @param {string} description A reason to explain why we are explicitly failing.
     * @returns {void}
     */
    with(description: string): void
}

/**
 * I report pending tests to the [test runner]{@link TestRunner}. Those tests will be displayed as WIP.
 */
export interface PendingMarker {
    /**
     * Indicates a test is not ready to be evaluated until the end to produce a final result, so it will be reported as a
     * [pending result]{@link TestResult.explicitlyMarkedAsPending}. If no reason is provided, an
     * [error result]{@link TestResult.error} will be reported instead.
     *
     * @param {!string} reason A required explanation to indicate why this test is not ready.
     * @returns {void}
     */
    dueTo(reason: string): void
}