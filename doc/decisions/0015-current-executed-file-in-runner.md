# 15. Current executed file in Test  Runner

Date: 2024-11-18

## Status

Accepted

## Context

For more readability, we wanted to print the current executed file path in the console as part of a test suite output

## Decision

Add a current executed file path value in `TestRunner` so it can be passed to every `TestSuite` when parsing the suite file.
This is only possible to do because the runner executes the suites sequentially.

## Consequences

The suite filepath is executed as part of the test output for each suite. 