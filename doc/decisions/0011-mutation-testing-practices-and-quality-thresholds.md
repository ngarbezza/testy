# 11. Use Mutation Testing and define quality thresholds

Date: 2022-10-24

## Status

Accepted

## Context

Given this tool was designed to serve as an example of well crafted code with the most up-to-date testing practices,
we think it is important to consider mutation testing as a practice. We are already considering Test-Driven Development
and mutation testing will be a great addition to this toolset.

## Decision

Start using mutation testing as part of the development flow. An automated tool will be setup to help detecting
surviving mutants. Developers should run a mutation testing report at least once before integrating the code into the
mainline. CI will run a mutation testing analysis reporting results on every push to the main branch.

## Consequences

* Another way to ensure high quality solutions: mutation score is a qualitative metric that can help us measure the 
quality of every introduced change.
* Slowness: the analysis is relatively slow compared with the time it takes to run the test suite, because every 
mutation forces a run of the entire test suite. But given the benefits, we accept this.
* Spreading mutation testing culture: sadly, mutation testing is not well known among developers, so this is a humble
attempt to show the benefits of it with concrete and practical examples.
