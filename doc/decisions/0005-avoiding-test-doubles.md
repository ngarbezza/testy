# 5. Avoiding test doubles

Date: 2020-12-15

## Status

Accepted

## Context

Tests against the real system instead of test doubles was proven to be useful detecting bugs and exercising better our
system.

## Decision

Avoid introducing test doubles as much as possible. The only allowed exception is to stub/simulate external systems we
can't control. Library code should never be stubbed. 

## Consequences

- Testing with all the real objects that are used in the tool.
- No need to maintain test doubles and their protocol that should match the real objects' protocols.
- Potentially more setup code, objects could be hard to setup because there are no shortcuts. This can be solved by
factory methods and/or test helpers.
