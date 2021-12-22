# 9. Asynchronous Code Support

Date: 2021-12-22

## Status

Accepted

## Context

It's necessary for a testing tool to support asynchronous code, the community is using a lot async/await in their code.

We want Testy to be competitive with other testing tools, so we need to provide a solution for asynchronous code.

## Decision

Fully implement asynchronous code support ([#106](https://github.com/ngarbezza/testy/issues/106)). This will allow us to
use async/await in both tests and hooks (before/after).

## Consequences

One of the main values, which is simplicity, is notably affected. There are many occurrences of `async` anc `await` in
places where before they were just common function calls. This also makes debugging harder, as not always we have a
clear sequence of steps.

Tests within a suite and suites within a test runner will still run in sequence, to avoid adding even more complexity
about dealing with parallelism.

Even though these consequences can be negative, all the possibilities it provides make this a good idea going
forward. It allows testing complex code that involves most of the libraries widely used.
