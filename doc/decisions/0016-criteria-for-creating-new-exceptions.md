# 16. Criteria for creating new exceptions

Date: 2025-04-21

## Status

Accepted

## Context

This tool has some exceptional flows that need to be designed with a common criteria.

## Decision

Create a new exception class **only** when we have at least one specific handler for it. If many business cases
have the same exception handler, we should not create an exception for each.

## Consequences

We'll have a limited number of exceptions, therefore tackling the complexity of the code early.
