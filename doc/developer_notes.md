# Testy Developer Notes

This article serves as a guide for Testy devs. It contains useful information about local development and testing.

## Run configuration for Webstorm

The recommended IDE to work with Testy is Webstorm. The project includes a run configuration called
`[testy] current file` which is convenient to just run the file you're currently on.

## Working with a playground

Usually it's convenient to run testy on a single file to try out some things, maybe some work in progress.

There are two npm scripts that might help you:

* `npm run playground:reset` creates a playground file (based on a template) containing a single suite with a single
failing test.
* `npm run playground:run` runs Testy with this single playground file.

## `npx testy` vs. `npm t`

There are two different ways to run Testy and they might be not equivalente:

* `npx testy` runs your local test files with **the latest `testy` binary released on NPM** as the runner.
* `npm t` runs your local test files with the local testy runner. This is the complete self-circular way of running
tests.

The second option is recommended unless you want to see what happens at the runner level with an older version of
the tool. Example: `npx testy@6.1.0`.
