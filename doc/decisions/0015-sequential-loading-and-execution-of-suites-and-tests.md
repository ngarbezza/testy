# 15. Sequential loading and execution of suites and tests

Date: 2024-11-30

## Status

Accepted

## Context

The loading of test suites files is done in a strictly sequential manner

## Decision

Loading the files sequentially allows the `TestRunner` to know which is the current file that is being loaded at the moment,
making possible for it to use this information when needed.

## Consequences

One example of use is that the `TestRunner` can indicate each `TestSuite` its own filepath to then be printed as part of the suite run output. 
