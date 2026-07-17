# 17. Simplicity Guardian

Date: 2026-06-29

## Status

Accepted

## Context

Testy's core identity is simplicity: zero external dependencies, no metaprogramming, and OOP in the
Smalltalk spirit. These values are documented in `CLAUDE.md` and individual ADRs, but nothing
enforced them automatically on every PR until now.

ESLint and SonarCloud already enforce a wide range of quality rules, but they are not specific to
Testy's design contract. A PR that adds a zero-line external import, or uses `new Proxy` to wrap
an object, would pass both tools yet violate Testy's identity.

## Decision

Add a **Simplicity Guardian** — a purpose-built CI check with three layers:

### Layer 1 — Zero-dependency

Detects imports of external packages (not relative paths, not `node:*` built-ins) in `lib/` and
`bin/`. ESLint cannot enforce this because it doesn't know which packages are external at lint time.

**Passes:** `import fs from 'node:fs'`, `import Formatter from './formatter.js'`  
**Fails:** `import chalk from 'chalk'`, `import { foo } from 'some-library'`

### Layer 2 — No metaprogramming

Detects patterns that intercept or redefine JavaScript's property access machinery:
`new Proxy(...)`, `Object.defineProperty(...)`, `Object.defineProperties(...)`, `__proto__ =`.

`Object.defineProperty` is also caught by an ESLint `no-restricted-syntax` rule (AST-based).
Both checks are intentional: ESLint runs on the AST and catches calls in any context; the
guardian runs as a regex scan and produces a unified JSON report that drives the PR comment
independently of ESLint's output.

**Passes:** regular property assignment (`obj.x = 1`), class field declarations  
**Fails:** `new Proxy(target, handler)`, `Object.defineProperty(obj, 'x', { get() {...} })`

### Layer 3 — Fan-out per file

Counts `import` statements per file. A file with more than 7 imports may be violating single
responsibility. The threshold is deliberate: the most complex files in Testy's core today sit at
or below 7 imports.

**Passes:** a file with 7 or fewer imports  
**Fails:** a file with 8 or more imports

### How it differs from ESLint and SonarCloud

| Concern | ESLint | SonarCloud | Simplicity Guardian |
|---|---|---|---|
| External package imports | ❌ not possible | ❌ not specific | ✅ Layer 1 |
| Metaprogramming patterns | ✅ `no-restricted-syntax` | ✅ generic rules | ✅ Layer 2 (also unified report) |
| Fan-out / coupling | ✅ `max-statements` etc. | ✅ | ✅ Layer 3 (import-specific) |
| Testy-specific contract | ❌ generic | ❌ generic | ✅ purpose-built |
| PR comment with details | ❌ | ❌ inline only | ✅ unified comment |

### Implementation

- `bin/simplicity-guardian.js` — zero-dependency Node.js CLI; outputs JSON with `violations` and `summary`
- `.github/workflows/simplicity_guardian.yml` — triggered on `pull_request` to `main`
- `.github/scripts/simplicity-guardian/` — scripts to read outputs and post the PR comment

## Consequences

* Every PR against `main` is checked against Testy's simplicity contract automatically.
* Contributors get a detailed PR comment explaining each violation with file and line number.
* The guardian adds a second, Testy-specific safety net on top of ESLint and SonarCloud — not
  a replacement for either.
* New layers can be added to `bin/simplicity-guardian.js` as the contract evolves.
