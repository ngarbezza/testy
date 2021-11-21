# 8. Define a Code Style Guide

Date: 2021-11-13

## Status

Accepted

## Context

Ensuring a consistent style in our current code and future changes on it. Make more clear and explicit for contributors
to know what rules to follow.

## Decision

Establish an initial version of a code style guide based on (in priority order):

1. Custom Rules
1. [Airbnb Style Guide](https://github.com/airbnb/javascript)
1. [ESLint `recommended` guide](https://github.com/eslint/eslint/blob/main/conf/eslint-recommended.js)

The first step allow us to iterate and modify existing rules, for instance: we do not agree with [Airbnb 7.1 section
about functions](https://github.com/airbnb/javascript#functions--declarations), that's why we don't have the
`func-style` rule.

Technically, we have an ESLint configuration. We don't depend on Airbnb Style Guide (because of decision #0003) but we
manually selected the rules we'd like to have.

It's worth mentioning that this is just a start, it should be possible at any time to iterate and modify ANY rule.

## Consequences

* Changes in current code: after applying these rules, we had to do some changes to the code, but the majority of the
code was already compliant.
* The code style will become more opinionated, but we prefer to have more rules and discuss/disable if needed, rather
than many code styles living in the same codebase.
* The priority order established between ESLint, Airbnb and custom rules allow us to have a baseline that is shared
with the community but having the flexibility to change some rules if needed.
* Having a large `.eslintrc` file with many rules: Given that we'd like to share this configuration, in the future,
those rules will be extracted into its own package (to be used by other tools similar to Testy)
