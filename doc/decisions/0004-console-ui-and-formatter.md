# 4. Console UI and Formatter

Date: 2020-10-28

## Status

Accepted

## Context

Reducing complexity in the `ConsoleUI` object and make it more reusable and testable.

## Decision

`ConsoleUI` now only knows when to output things, but not the contents of messages, which is now responsibility of a
`Formatter`. This object can be replaced by other formatters in the future.

## Consequences

* `Formatter` becomes testable, as well as `ConsoleUI`
* Responsibilities are better split 
* There are more control on Node built-in modules, `Formatter` now talks to `console` object, and `ConsoleUI` to
`process`
