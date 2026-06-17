# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project DNA

These values act as a filter for every proposed change. Reject anything that violates them.

- **Zero dependencies** — no runtime npm dependencies in library code (see `doc/decisions/0003-zero-dependencies.md`). Refuse any change that adds an `import` from an external package inside `lib/` or `bin/`.
- **No dark magic** — no Proxies, no monkey-patching, no metaprogramming. Every line must be readable in a classroom without prior explanation.
- **OOP in the Smalltalk spirit** — behaviour through message sends and polymorphism, not conditionals over types. Add a method to an object before adding a `switch`/`if` chain in a caller.

## Commands

```bash
npm test                          # run all tests (self-tests the framework)
npm test tests/path/file_test.js  # run a single test file
npm run lint                      # ESLint check
npm run lint:fix                  # ESLint auto-fix
npm run playground:reset          # copy template → tests/playground_test.js
npm run playground:run            # run playground file
npm run playground:clear          # delete playground file
npm run test:coverage             # coverage report via c8 (see reports/coverage/)
npm run test:mutation             # mutation testing via Stryker (slow, see reports/mutation/)
```

Node 22+ is required. The repo uses asdf; `.tool-versions` pins `nodejs 22.21.0`.

## Architecture

### Execution flow

`bin/testy_cli.js` → `ScriptAction.for(params)` (handles `-h`, `-v`, or `RunTests`) → `Testy#run()` → loads test files via dynamic `import()` → `TestRunner#run()` → emits callbacks → `ConsoleUI` → `Formatter`.

### Core domain (`lib/core/`)

- **`TestRunner`** — orchestrates suites; aggregates counts; drives the `onFinish`/`onSuccess`/`onFailure` callbacks.
- **`TestSuite`** — owns a list of `Test` instances; runs each; fires `onStart`/`onFinish` suite callbacks.
- **`Test`** — executes one test body; stores a `TestResult`; fires `whenSuccess`/`whenFailed`/`whenErrored`/`whenPending`/`whenSkipped` callbacks.
- **`Asserter` / `Assertion`** — assertion DSL. Primary form: `assert.that(actual).isEqualTo(expected)`. Shorthand form: `assert.areEqual(actual, expected)`. Custom failure message: `assert.withDescription('msg').isTrue(expr)`.

### UI layer (`lib/ui/`)

**`ConsoleUI`** is the event hub. It converts `TestRunner`/`TestSuite`/`Test` callbacks into calls on the active `Formatter`.

**`Formatter`** (base class) defines the full event protocol as no-op methods. Concrete subclasses:
- `ConsoleFormatter` — human-readable, coloured output (default)
- `TapFormatter` — TAP version 13 (streaming, one line per test)
- `JsonFormatter` — single JSON document emitted on `displayRunnerEnd`

**`FormatterFactory.for(output, console, i18n)`** maps the `output` config key to the right class; unknown values fall back to `ConsoleFormatter`.

### Configuration (`lib/config/`)

`Configuration` merges `.testyrc.json` (user, optional) over `default_configuration.json`. Keys: `directory`, `filter`, `language`, `failFast`, `randomOrder`, `timeoutMs`, `output`.

`ParametersParser` maps CLI flags to a config object. Paired flags (`-l`, `-d`, `-e`, `-o`) are sanitized into `"flag value"` strings before dispatch to per-flag parser classes.

### i18n (`lib/i18n/`)

`translations.json` holds all UI strings in `en`, `es`, `it`, `pt`. Failure messages implement `.expressedIn(i18n)` so they resolve lazily in the configured language. Adding a translation key requires entries in **all four** language sections — `tests/core/translation_keys_consistency_test.js` will catch any missing ones.

### Test support (`tests/support/`)

- **`tests_factory.js`** — factories for `Test` instances in each result state (`aPassingTest`, `aFailingTest`, `anErroredTest`, `aPendingTest`, `anExplicitlySkippedTest`). Factories accept an `asserter` argument.
- **`formatter_helpers.js`** — `runResultsWith(suiteName, ...factories)` runs tests and returns `{ runner, suite }`; `driveFormatter(formatter, runner, suite)` replays the full event stream into a formatter.
- **`runner_helpers.js` / `suites_factory.js`** — lower-level helpers for building runners and suites in tests.

## Key conventions

- **Pure ES modules** — `"type": "module"` throughout. No CommonJS `require` in `lib/`, except `createRequire` for reading JSON files (e.g. `package.json`).
- **Private fields** — use `#fieldName` syntax (not underscore prefixes).
- **No `for...of` / `for...in` in `lib/`** — ESLint enforces this; use array iteration methods instead. The `for...of` ban is explicitly `eslint-disable`d in the two places where sequential async iteration is unavoidable (`testy.js`).
- **`no-empty-function`** — no-op methods in base classes must have a `// no-op` comment inside the body.
- **`prefer-destructuring`** — use destructuring rather than index access: `const [, value] = arr` not `const value = arr[1]`.
- **`id-length`** — identifiers must be more than one character; use `_` prefix for unused params (`_param`).
- **Test file naming** — `*_test.js`; the default filter regex is `.*_test.js$`.
- **`doc/plans/`** — gitignored; ephemeral AI-assisted implementation plans go here and are never committed.

## Extending the framework

**New assertion:** add to `lib/core/assertion.js` (instance method) and optionally a shorthand in `lib/core/asserter.js`.

**New output format:** create a subclass of `Formatter`, override the event methods you need, register it in `FormatterFactory`.

**New i18n message:** add the key to all four language sections in `lib/i18n/translations.json`, then use `I18nMessage.of('key')` or `this.translated('key')` in a formatter.

## Contributing conventions

- **Self-testing is mandatory** — every feature or fix must be accompanied by a test in `tests/`. If Testy cannot test its own change, something is wrong with the design.
- **One PR, one concept** — no opportunistic refactors bundled in the same PR.
- **Run `npm test` and `npm run lint` before opening a PR** — CI will catch failures, but it's faster to catch them locally.
