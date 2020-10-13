# 3. Zero dependencies

Date: 2020-10-13

## Status

Accepted

## Context

Keeping the tool simple, minimal, easy to install and understand.

## Decision

Do not depend on any NPM package unless there's a strong reason to do that. Keep the zero dependence counter as much as possible.

## Consequences

1. We will be "reimplementing" things, like file handling functions, or `isEmpty` or `isUndefined` type of queries, but that's fine. We want to keep control of that, and we can keep that in a single place, `Utils` (see decision 0002).
2. If there's a security problem, we will be 100% sure our code is causing it.
