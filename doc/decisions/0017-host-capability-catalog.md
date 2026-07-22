# 17. Host capability catalog

Date: 2026-07-22

## Status

Accepted

## Context

Testy wants to decouple itself from the specific language and runtime it happens
to run on, so that porting it to another language becomes a matter of design
translation rather than archaeology.

Today the coupling to Node internals is scattered but small (around seven contact
points). The valuable artifact for a port is **not** a JavaScript wrapper over
`fs` or `console` — that code is thrown away when the framework is rewritten in
another language. What survives the port is knowing *what Testy needs from its
host*: the set of capabilities the core relies on, named in domain terms.

This decision names that set. It builds on existing decisions:

- 0003 (zero dependencies) — we already reimplement host-adjacent helpers rather
  than pulling packages, so isolating them is consistent.
- 0002 (utilities in the `Utils` module) — reimplementable algorithms already live
  there.
- 0004 (console UI and formatter) — `console` and `process` are already injected
  into `ConsoleUI`/`Formatter`, so there is precedent for treating host access as
  an injected collaborator rather than a direct dependency.

## Decision

Treat the capabilities Testy requires from its host as an **explicit, named
contract** — the portability seam. The core is defined in terms of *what it needs
from the host*, not in terms of the Node API names that currently satisfy those
needs.

Capabilities are classified into two kinds, because they port very differently:

### Host services (I/O; runtime-dependent; injectable)

Behaviour that talks to the outside world. It changes per runtime (Node, Deno,
Bun, browser) and is a natural injection point for fakes in Testy's own tests.

1. **File discovery** — find the files matching a pattern under a directory.
   Today: `lib/utils/files.js` (`allFilesMatching`, `resolvePathFor`) via
   `fs.lstatSync`, `fs.readdirSync`, `path.join`/`path.resolve`, `process.cwd()`.
2. **File removal** — delete a temporary file.
   Today: `lib/testy.js` (`fs.unlinkSync`) and the TypeScript cache directory.
3. **Output sink** — print lines and emit timing marks.
   Today: `lib/ui/formatter.js` via `console.log`/`console.time`/`console.timeEnd`.
4. **Process control** — terminate with an exit code and read CLI arguments.
   Today: `lib/ui/console_ui.js` (`process.exit`) and `bin/testy_cli.js`
   (`process.argv`).
5. **Clock** — obtain the current time in milliseconds.
   Today: `lib/ui/tap_formatter.js` and `lib/ui/json_formatter.js` via `Date.now()`.
6. **Test module loading** — load and evaluate a test file given its path, and
   read JSON documents (configuration, translations, `package.json`).
   Today: dynamic `import()` + `pathToFileURL` and `createRequire` across
   `lib/testy.js`, `lib/config/configuration.js`, `lib/i18n/i18n.js`,
   `lib/script_action.js`, `lib/ui/json_formatter.js`.
   **This is the hardest seam and the least portable capability**: loading and
   evaluating a test file is intrinsically language-specific. Naming it isolates
   it; it does not make it abstract.

### Reimplementable semantics (algorithms; rewritten per language)

Pure computations, not I/O. A port reimplements these directly in the target
language; there is nothing to inject.

1. **Deep structural equality** — compare two values by structure.
   Today: `lib/utils/comparison.js` via `util.isDeepStrictEqual`.
2. **Object inspection / string representation** — render a value as a
   human-readable string for output.
   Today: `lib/utils/formatting.js` via `util.inspect`.

### Design rules

- Name each capability in **domain verbs** (`allFilesMatching`, "print a line"),
  never as a one-to-one passthrough of the Node API (`readdirSync`, `lstatSync`).
  A thin passthrough adds indirection without value; the contract must describe
  what Testy needs, not what Node offers.
- Keep host services behind **injectable collaborators**, following the precedent
  of 0004.
- Keep reimplementable semantics isolated in `Utils`, so a port can rewrite them
  without touching the core.

This decision does **not** commit to the concrete shape of a `Platform` /
`Environment` object. It fixes the contract and the classification; the concrete
injection design is deferred to its own decision.

### Out of scope

The TypeScript transpiler (`lib/typescript/`) is a host-specific extension, not
part of the portable core. A port is not expected to reproduce it.

## Consequences

1. A language port has a concrete checklist: implement N host services plus M
   reimplementable algorithms, and provide a test-loading mechanism for the target
   language.
2. Testability improves: host services can be faked in Testy's own tests, which is
   itself the proof that the seam is real.
3. Portability across JavaScript runtimes (Deno, Bun, browser, workers) improves
   for free, since the core stops naming Node modules directly.
4. Test module loading remains a **known boundary**: it is named but not made
   portable, and every port must solve it in its own terms.
5. There is an indirection cost. It is mitigated by defining the contract in domain
   verbs rather than mirroring the Node API.
6. The direction is consistent with the project DNA (zero dependencies, no dark
   magic, message-sends over conditionals) and with the injection already present
   in the console/formatter layer.
