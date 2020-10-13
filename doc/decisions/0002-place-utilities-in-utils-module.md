# 2. Place utilities in Utils module

Date: 2020-10-13

## Status

Accepted

## Context

Having control of all the utilitary functions the tool might need.

## Decision

Use the `Utils` module for any responsibility whose domain does not seem to be part of other objects' essence. Every time you feel you need a "helper" function, it is a good candidate for `Utils`. If you need to rely on `typeof`, it is also a good sign for needing `Utils`. We want to maximize reuse of these functions by having in a single, "static" place. We understand this might be a temporary solution.

## Consequences

1. We will have a centralized place of all the logic that needs to be placed somewhere.
2. `Utils` module can potentially become a hotspot in the code, or a file that grows at a high pace. A subfolder with particular Utils might be needed at some point in the future.
3. `Utils` is also a good place for interaction with external dependencies, although we want to keep zero dependencies.
