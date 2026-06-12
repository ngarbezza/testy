# LLM-Friendly Output (TAP + JSON) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add two machine-readable output formats to Testy — TAP and JSON — selectable via an `output` config key and a `-o`/`--output` CLI flag, so an LLM agent can consume test results with few tokens.

**Architecture:** Introduce a polymorphic `Formatter` family. A base `Formatter` defines the event protocol (`display*` + lifecycle) with no-op defaults and protected helpers (`print`, `translated`, `internationalized`). Three concrete subclasses: `ConsoleFormatter` (the current human output, unchanged), `TapFormatter` (streaming, line-per-test), `JsonFormatter` (one structured object at the end). `ConsoleUI` picks one via a `FormatterFactory` keyed on `configuration.output()`. Status tokens are language-neutral; failure messages are resolved in the configured language.

**Tech Stack:** Node 20+, ES modules, zero runtime dependencies. Testy is self-tested (tests live in `tests/`, run with `node bin/testy_cli.js <file>`).

**Design reference:** [`doc/plans/2026-06-06-llm-friendly-output-design.md`](2026-06-06-llm-friendly-output-design.md)

**Conventions for the executor:**
- Use @superpowers:test-driven-development for every behavioral task (red → green → commit).
- Run a single test file with: `node bin/testy_cli.js <path-to-test-file>`
- Run the full suite with: `npm test`
- Run the linter with: `npm run lint`
- Commit after each task. Keep commits small. End commit messages with the `Co-Authored-By` trailer used in this repo.

---

## Task 1: Refactor — extract base `Formatter` and `ConsoleFormatter` (no behavior change)

This is a pure refactor done under a green test suite (no new behavior). The existing `tests/ui/formatter_test.js` is the safety net.

**Files:**
- Create: `lib/ui/formatter.js` (new base class — replaces the current file content)
- Create: `lib/ui/console_formatter.js` (the current human formatter, moved + adapted)
- Modify: `lib/ui/console_ui.js` (import `ConsoleFormatter` for now; the factory comes in Task 4)
- Rename + modify: `tests/ui/formatter_test.js` → `tests/ui/console_formatter_test.js`

**Step 1: Capture the current green state**

Run: `npm test`
Expected: PASS (all suites green). This is the baseline the refactor must preserve.

**Step 2: Write the new base `Formatter`**

Overwrite `lib/ui/formatter.js` with the base class. It owns `console` + `i18n` privately and exposes protected helpers plus no-op event defaults:

```javascript
import { isString } from '../utils/index.js';

/**
 * I am the base of the formatter family. I define the protocol of events that a
 * {@link ConsoleUI} sends (lifecycle + display of test results) with no-op defaults,
 * and I provide protected helpers for my subclasses to print and translate text.
 *
 * Concrete subclasses: {@link ConsoleFormatter} (human output), {@link TapFormatter},
 * {@link JsonFormatter} (machine-readable output).
 */
export class Formatter {
  #console;
  #i18n;

  constructor(console, i18n) {
    this.#console = console;
    this.#i18n = i18n;
  }

  // protected helpers for subclasses

  print(text) {
    this.#console.log(text);
  }

  startConsoleTimer(name) {
    this.#console.time(name);
  }

  endConsoleTimer(name) {
    this.#console.timeEnd(name);
  }

  translated(key) {
    return this.#i18n.translate(key);
  }

  internationalized(text) {
    return isString(text) ? text : text.expressedIn(this.#i18n);
  }

  // event protocol — no-op defaults, overridden by subclasses as needed

  startTimer() {}
  endTimer() {}
  displayInitialInformation(_configuration, _paths) {}
  displaySuiteStart(_suite) {}
  displaySuiteEnd(_suite) {}
  displayPendingResult(_test) {}
  displaySkippedResult(_test) {}
  displaySuccessResult(_test) {}
  displayFailureResult(_test, _failType) {}
  displayRunnerEnd(_runner) {}
  displayError(_message) {}
}
```

**Step 3: Create `ConsoleFormatter` from the old formatter body**

Create `lib/ui/console_formatter.js` with the *current* formatter logic, now extending `Formatter`. Apply these mechanical changes to the old body:

- Class header: `export class ConsoleFormatter extends Formatter {`
- Add `import { Formatter } from './formatter.js';` and keep `import { isEmpty, isString } from '../utils/index.js';` (only `isEmpty` is still needed here — `isString` moved to the base, so import just `{ isEmpty }`).
- Remove the `#console` and `#i18n` fields. Keep `#timerName` and `#filter`.
- New constructor:
  ```javascript
  constructor(console, i18n) {
    super(console, i18n);
    this.#timerName = this.translated('total_time');
  }
  ```
- `startTimer()` → `this.startConsoleTimer(this.#timerName);`
- `endTimer()` → `this.endConsoleTimer(this.#timerName);`
- Replace every `this.#console.log(` with `this.print(`
- Replace every `this.#translated(` with `this.translated(`
- Replace every `this.#potentiallyInternationalized(` with `this.internationalized(`
- Delete the now-unused private methods `#translated(key)` and `#potentiallyInternationalized(text)`.
- Keep all other private methods unchanged (`#displayResult`, `#displayResultDetail`, `#displayErrorsAndFailuresSummary`, `#displayGeneralSummary`, `#displaySuiteFilePath`, `#displayCountFor`, `#displayIfNonZero`, `#displaySeparator`, `#inBold`, `#withColor`, `#humanBoolean`, `#displayConfigurationSummary`).

**Step 4: Point `ConsoleUI` at `ConsoleFormatter` (temporary, replaced in Task 4)**

In `lib/ui/console_ui.js`:
- Change `import { Formatter } from './formatter.js';` → `import { ConsoleFormatter } from './console_formatter.js';`
- In `#useLanguage`, change `this.#formatter = new Formatter(this.#console, i18n);` → `this.#formatter = new ConsoleFormatter(this.#console, i18n);`

**Step 5: Move + update the formatter test**

Run: `git mv tests/ui/formatter_test.js tests/ui/console_formatter_test.js`

In `tests/ui/console_formatter_test.js`:
- Change `import { Formatter } from '../../lib/ui/formatter.js';` → `import { ConsoleFormatter } from '../../lib/ui/console_formatter.js';`
- Change `formatter = new Formatter(fakeConsole, i18n);` → `formatter = new ConsoleFormatter(fakeConsole, i18n);`
- Change the top-level `suite('formatter', ...)` label to `suite('console formatter', ...)`.

**Step 6: Verify the refactor preserved behavior**

Run: `npm test`
Expected: PASS (same results as Step 1).

Run: `npm run lint`
Expected: no errors.

**Step 7: Commit**

```bash
git add lib/ui/formatter.js lib/ui/console_formatter.js lib/ui/console_ui.js tests/ui/console_formatter_test.js
git commit -m "$(cat <<'EOF'
Extract base Formatter and ConsoleFormatter (#380)

Pure refactor under green tests: base Formatter defines the event
protocol with no-op defaults and protected helpers; ConsoleFormatter
holds the existing human output unchanged.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Shared test helper for driving formatters

Both formatter tests need to (a) run a set of tests through a real runner to get results, and (b) replay the event stream into a formatter exactly as `ConsoleUI` would. Extract that once.

**Files:**
- Create: `tests/support/formatter_helpers.js`

**Step 1: Write the helper**

```javascript
import { TestSuite } from '../../lib/core/test_suite.js';
import { Configuration } from '../../lib/config/configuration.js';
import { withRunnerAndCallbacks, emptyRunnerCallbacks } from './runner_helpers.js';
import { emptySuiteCallbacks, fakePathLocation } from './suites_factory.js';

const configForRun = new Configuration({ failFast: false, randomOrder: false, timeoutMs: 50 });

/**
 * Runs the given test-factory functions inside one suite and returns the runner and the
 * suite after execution, so a formatter can be driven against real results.
 *
 * Each factory receives the asserter (factories that don't need it just ignore the argument).
 */
const runResultsWith = async(suiteName, ...testFactories) =>
  withRunnerAndCallbacks(emptyRunnerCallbacks, async(runner, asserter) => {
    const suite = new TestSuite(suiteName, () => {}, emptySuiteCallbacks, fakePathLocation);
    testFactories.forEach(makeTest => suite.addTest(makeTest(asserter)));
    runner.addSuite(suite);
    runner.configureWith(configForRun);
    await runner.run();
    return { runner, suite };
  });

/**
 * Replays a finished test into the formatter using the same dispatch logic as
 * ConsoleUI.testCallbacks().
 */
const dispatchResultTo = (formatter, test) => {
  if (test.isSuccess()) {
    formatter.displaySuccessResult(test);
  } else if (test.isFailure()) {
    formatter.displayFailureResult(test, 'fail');
  } else if (test.isError()) {
    formatter.displayFailureResult(test, 'error');
  } else if (test.isPending()) {
    formatter.displayPendingResult(test);
  } else {
    formatter.displaySkippedResult(test);
  }
};

/**
 * Drives the full event stream (suite start, every test result, runner end) into the
 * formatter, exactly as ConsoleUI would during a real run.
 */
const driveFormatter = (formatter, runner, suite) => {
  formatter.displaySuiteStart(suite);
  suite.tests().forEach(test => dispatchResultTo(formatter, test));
  formatter.displaySuiteEnd(suite);
  formatter.displayRunnerEnd(runner);
};

export { runResultsWith, dispatchResultTo, driveFormatter };
```

**Step 2: Sanity-check it loads (no test yet)**

This file is exercised by Tasks 3 and 5. No standalone run. Continue.

**Step 3: Commit**

```bash
git add tests/support/formatter_helpers.js
git commit -m "$(cat <<'EOF'
Add formatter test helpers for driving the event stream (#380)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: `TapFormatter`

Use @superpowers:test-driven-development.

**Output contract (TAP version 13):**
- Header line `TAP version 13` on `displayInitialInformation`.
- One line per test, numbered from 1 in stream order:
  - success → `ok N - <name>`
  - skipped → `ok N - <name> # SKIP`
  - pending → `ok N - <name> # TODO`
  - failure → `not ok N - <name>` then a YAML diagnostic block (5 lines)
  - error → `not ok N - <name>` then a YAML diagnostic block with `severity: error`
- YAML diagnostic block (each line is a separate `print`):
  ```
    ---
    message: <resolved message, newlines collapsed to spaces>
    at: <location>
    severity: <failure|error>
    ---
  ```
- On `displayRunnerEnd`: the trailing plan `1..<total>`, then summary comment lines, then a time comment:
  ```
  1..N
  # tests N
  # pass N
  # fail N
  # error N
  # pending N
  # skip N
  # time <ms>ms
  ```

**Files:**
- Create: `lib/ui/tap_formatter.js`
- Test: `tests/ui/tap_formatter_test.js`

**Step 1: Write the failing tests**

```javascript
import { assert, before, suite, test } from '../../lib/testy.js';
import { aPassingTest, aFailingTest, anErroredTest, aPendingTest, anExplicitlySkippedTest } from '../support/tests_factory.js';
import { runResultsWith, driveFormatter } from '../support/formatter_helpers.js';
import { TapFormatter } from '../../lib/ui/tap_formatter.js';
import { I18n } from '../../lib/i18n/i18n.js';
import { FakeConsole } from './fake_console.js';

suite('tap formatter', () => {
  let formatter, fakeConsole;

  before(() => {
    fakeConsole = new FakeConsole();
    formatter = new TapFormatter(fakeConsole, I18n.default());
  });

  test('emits the TAP version header on initial information', () => {
    formatter.displayInitialInformation({}, ['tests']);
    assert.that(fakeConsole.messages()).includesExactly('TAP version 13');
  });

  test('emits ok lines for passing tests and a trailing plan', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('s', aPassingTest, aPassingTest);
    driveFormatter(formatter, runner, ranSuite);
    const messages = fakeConsole.messages();
    assert.that(messages).includes('ok 1 - a pure success');
    assert.that(messages).includes('ok 2 - a pure success');
    assert.that(messages).includes('1..2');
    assert.that(messages).includes('# pass 2');
  });

  test('emits a SKIP directive for skipped tests', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('s', anExplicitlySkippedTest);
    driveFormatter(formatter, runner, ranSuite);
    assert.that(fakeConsole.messages()).includes('ok 1 - a test that is skipped # SKIP');
  });

  test('emits a TODO directive for pending tests', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('s', aPendingTest);
    driveFormatter(formatter, runner, ranSuite);
    assert.that(fakeConsole.messages()).includes('ok 1 - a work in progress # TODO');
  });

  test('emits not ok plus a failure diagnostic block for failures', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('s', aFailingTest);
    driveFormatter(formatter, runner, ranSuite);
    const messages = fakeConsole.messages();
    assert.that(messages).includes('not ok 1 - a true failure');
    assert.that(messages).includes('  ---');
    assert.that(messages).includes('  severity: failure');
    assert.that(messages).includes('# fail 1');
  });

  test('marks errors with severity error', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('s', anErroredTest);
    driveFormatter(formatter, runner, ranSuite);
    const messages = fakeConsole.messages();
    assert.that(messages).includes('not ok 1 - an unexpected error');
    assert.that(messages).includes('  severity: error');
    assert.that(messages).includes('# error 1');
  });
});
```

**Step 2: Run the tests to verify they fail**

Run: `node bin/testy_cli.js tests/ui/tap_formatter_test.js`
Expected: FAIL — cannot import `TapFormatter` (module not found).

**Step 3: Implement `TapFormatter`**

```javascript
import { Formatter } from './formatter.js';

/**
 * I present test results in TAP (Test Anything Protocol) version 13: a compact, line-oriented,
 * machine-readable format. I stream one line per test and finish with a trailing plan and summary.
 */
export class TapFormatter extends Formatter {
  #testNumber;
  #startTime;

  constructor(console, i18n) {
    super(console, i18n);
    this.#testNumber = 0;
    this.#startTime = 0;
  }

  startTimer() {
    this.#startTime = Date.now();
  }

  displayInitialInformation(_configuration, _paths) {
    this.print('TAP version 13');
  }

  displaySuccessResult(test) {
    this.print(`ok ${this.#nextNumber()} - ${test.name()}`);
  }

  displaySkippedResult(test) {
    this.print(`ok ${this.#nextNumber()} - ${test.name()} # SKIP`);
  }

  displayPendingResult(test) {
    this.print(`ok ${this.#nextNumber()} - ${test.name()} # TODO`);
  }

  displayFailureResult(test, failType) {
    const severity = failType === 'error' ? 'error' : 'failure';
    this.print(`not ok ${this.#nextNumber()} - ${test.name()}`);
    this.#printDiagnostic(test, severity);
  }

  displayRunnerEnd(runner) {
    this.print(`1..${runner.totalCount()}`);
    this.print(`# tests ${runner.totalCount()}`);
    this.print(`# pass ${runner.successCount()}`);
    this.print(`# fail ${runner.failuresCount()}`);
    this.print(`# error ${runner.errorsCount()}`);
    this.print(`# pending ${runner.pendingCount()}`);
    this.print(`# skip ${runner.skippedCount()}`);
    this.print(`# time ${Date.now() - this.#startTime}ms`);
  }

  #printDiagnostic(test, severity) {
    const message = this.#singleLine(this.internationalized(test.result().failureMessage()));
    const location = this.internationalized(test.result().location());
    this.print('  ---');
    this.print(`  message: ${message}`);
    this.print(`  at: ${location}`);
    this.print(`  severity: ${severity}`);
    this.print('  ---');
  }

  #singleLine(text) {
    return String(text).replace(/\s*\n\s*/g, ' ').trim();
  }

  #nextNumber() {
    this.#testNumber += 1;
    return this.#testNumber;
  }
}
```

**Step 4: Run the tests to verify they pass**

Run: `node bin/testy_cli.js tests/ui/tap_formatter_test.js`
Expected: PASS (all tests in the file).

**Step 5: Lint**

Run: `npm run lint`
Expected: no errors.

**Step 6: Commit**

```bash
git add lib/ui/tap_formatter.js tests/ui/tap_formatter_test.js
git commit -m "$(cat <<'EOF'
Add TapFormatter for TAP version 13 output (#380)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: `FormatterFactory` and `ConsoleUI` wiring

Use @superpowers:test-driven-development. (`JsonFormatter` does not exist yet; the factory will map `'json'` to it, so create a minimal placeholder first to keep imports valid, then flesh it out in Task 5. To avoid a broken import, do Task 5 BEFORE wiring `'json'`. Therefore: in this task, build the factory for `console` and `tap` only, plus `ConsoleUI` wiring; add the `json` mapping at the end of Task 5.)

**Files:**
- Create: `lib/ui/formatter_factory.js`
- Modify: `lib/ui/console_ui.js`
- Test: `tests/ui/formatter_factory_test.js`

**Step 1: Write the failing tests**

```javascript
import { assert, suite, test } from '../../lib/testy.js';
import { FormatterFactory } from '../../lib/ui/formatter_factory.js';
import { ConsoleFormatter } from '../../lib/ui/console_formatter.js';
import { TapFormatter } from '../../lib/ui/tap_formatter.js';
import { I18n } from '../../lib/i18n/i18n.js';
import { FakeConsole } from './fake_console.js';

suite('formatter factory', () => {
  const build = output => FormatterFactory.for(output, new FakeConsole(), I18n.default());

  test('builds a ConsoleFormatter for "console"', () => {
    assert.that(build('console') instanceof ConsoleFormatter).isTrue();
  });

  test('builds a TapFormatter for "tap"', () => {
    assert.that(build('tap') instanceof TapFormatter).isTrue();
  });

  test('falls back to ConsoleFormatter for an unknown output', () => {
    assert.that(build('nonsense') instanceof ConsoleFormatter).isTrue();
  });
});
```

**Step 2: Run to verify failure**

Run: `node bin/testy_cli.js tests/ui/formatter_factory_test.js`
Expected: FAIL — `FormatterFactory` module not found.

**Step 3: Implement the factory**

```javascript
import { ConsoleFormatter } from './console_formatter.js';
import { TapFormatter } from './tap_formatter.js';
import { JsonFormatter } from './json_formatter.js';

/**
 * I build the right {@link Formatter} for a configured output format, defaulting to the
 * human-readable {@link ConsoleFormatter} when the format is unknown.
 */
export class FormatterFactory {
  static for(output, console, i18n) {
    const formatters = {
      console: ConsoleFormatter,
      tap: TapFormatter,
      json: JsonFormatter,
    };
    const FormatterClass = formatters[output] || ConsoleFormatter;
    return new FormatterClass(console, i18n);
  }
}
```

> NOTE: This imports `JsonFormatter`, which is created in Task 5. If you are doing Task 4 strictly before Task 5, temporarily omit the `JsonFormatter` import and the `json:` entry, then add them at the end of Task 5. Otherwise do Task 5 first.

**Step 4: Wire `ConsoleUI` to the factory**

In `lib/ui/console_ui.js`:
- Replace `import { ConsoleFormatter } from './console_formatter.js';` with `import { FormatterFactory } from './formatter_factory.js';`
- Rename the private method `#useLanguage(language)` to `#useFormatter(language, output)`:
  ```javascript
  #useFormatter(language, output) {
    const i18n = new I18n(language);
    this.#formatter = FormatterFactory.for(output, this.#console, i18n);
  }
  ```
- In the constructor, change `this.#useLanguage(I18n.defaultLanguage());` → `this.#useFormatter(I18n.defaultLanguage(), 'console');`
- In `configureWith`, change `this.#useLanguage(configuration.language());` → `this.#useFormatter(configuration.language(), configuration.output());`

> `configuration.output()` is added in Task 6. If wiring before Task 6, the call will throw at runtime; the unit suite for the factory does not exercise `ConsoleUI`, so it stays green. Run the FULL suite only after Task 6.

**Step 5: Run the factory tests to verify they pass**

Run: `node bin/testy_cli.js tests/ui/formatter_factory_test.js`
Expected: PASS.

**Step 6: Lint + commit**

Run: `npm run lint` → no errors.

```bash
git add lib/ui/formatter_factory.js lib/ui/console_ui.js tests/ui/formatter_factory_test.js
git commit -m "$(cat <<'EOF'
Add FormatterFactory and wire ConsoleUI to select output format (#380)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: `JsonFormatter`

Use @superpowers:test-driven-development.

**Output contract:** a single JSON object printed once on `displayRunnerEnd`:

```json
{
  "tool": "@pmoo/testy",
  "version": "8.0.0",
  "summary": { "total": 3, "passed": 1, "failed": 1, "errored": 0, "pending": 0, "skipped": 1, "durationMs": 12 },
  "suites": [
    { "name": "a boring test suite", "file": "tests/example_test.js",
      "tests": [
        { "name": "42 is 42, not surprising", "status": "passed" },
        { "name": "sum works", "status": "failed", "failure": { "message": "...", "location": "..." } },
        { "name": "a skipped one", "status": "skipped" }
      ] }
  ]
}
```

- `status`: `passed | failed | errored | pending | skipped`.
- `failure` is present only for `failed`/`errored`, with `message` (resolved in the configured language) and `location`.
- The formatter accumulates suites/tests via the callbacks and emits once at the end.

**Files:**
- Create: `lib/ui/json_formatter.js`
- Test: `tests/ui/json_formatter_test.js`

**Step 1: Write the failing tests**

```javascript
import { assert, before, suite, test } from '../../lib/testy.js';
import { aPassingTest, aFailingTest, anErroredTest, aPendingTest, anExplicitlySkippedTest } from '../support/tests_factory.js';
import { runResultsWith, driveFormatter } from '../support/formatter_helpers.js';
import { JsonFormatter } from '../../lib/ui/json_formatter.js';
import { I18n } from '../../lib/i18n/i18n.js';
import { FakeConsole } from './fake_console.js';

suite('json formatter', () => {
  let formatter, fakeConsole;

  const reportFrom = () => JSON.parse(fakeConsole.messages()[0]);

  before(() => {
    fakeConsole = new FakeConsole();
    formatter = new JsonFormatter(fakeConsole, I18n.default());
  });

  test('emits exactly one JSON document', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('a suite', aPassingTest);
    driveFormatter(formatter, runner, ranSuite);
    assert.that(fakeConsole.messages().length).isEqualTo(1);
  });

  test('reports the tool name and a version string', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('a suite', aPassingTest);
    driveFormatter(formatter, runner, ranSuite);
    const report = reportFrom();
    assert.that(report.tool).isEqualTo('@pmoo/testy');
    assert.that(report.version).matches(/^\d+\.\d+\.\d+/);
  });

  test('summarizes counts across statuses', async() => {
    const { runner, suite: ranSuite } =
      await runResultsWith('a suite', aPassingTest, aFailingTest, anErroredTest, aPendingTest, anExplicitlySkippedTest);
    driveFormatter(formatter, runner, ranSuite);
    const summary = reportFrom().summary;
    assert.that(summary.total).isEqualTo(5);
    assert.that(summary.passed).isEqualTo(1);
    assert.that(summary.failed).isEqualTo(1);
    assert.that(summary.errored).isEqualTo(1);
    assert.that(summary.pending).isEqualTo(1);
    assert.that(summary.skipped).isEqualTo(1);
    assert.that(summary.durationMs).isGreaterThanOrEqualTo(0);
  });

  test('records each test name, status, and the suite file', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('a suite', aPassingTest);
    driveFormatter(formatter, runner, ranSuite);
    const report = reportFrom();
    assert.that(report.suites.length).isEqualTo(1);
    assert.that(report.suites[0].name).isEqualTo('a suite');
    assert.that(report.suites[0].file).isEqualTo('I/am/a/fake/path/location');
    assert.that(report.suites[0].tests).includes({ name: 'a pure success', status: 'passed' });
  });

  test('includes a failure block for failed tests', async() => {
    const { runner, suite: ranSuite } = await runResultsWith('a suite', aFailingTest);
    driveFormatter(formatter, runner, ranSuite);
    const failedTest = reportFrom().suites[0].tests[0];
    assert.that(failedTest.status).isEqualTo('failed');
    assert.that(failedTest.failure.message).isNotUndefined();
  });
});
```

**Step 2: Run to verify failure**

Run: `node bin/testy_cli.js tests/ui/json_formatter_test.js`
Expected: FAIL — `JsonFormatter` module not found.

**Step 3: Implement `JsonFormatter`**

```javascript
import { createRequire } from 'module';
import { Formatter } from './formatter.js';

const require = createRequire(import.meta.url);
const { name: toolName, version: toolVersion } = require('../../package.json');

/**
 * I accumulate test results as the run progresses and emit a single structured JSON document
 * when the run finishes. Status tokens are language-neutral; failure messages are resolved in
 * the configured language.
 */
export class JsonFormatter extends Formatter {
  #suites;
  #currentSuite;
  #startTime;

  constructor(console, i18n) {
    super(console, i18n);
    this.#suites = [];
    this.#currentSuite = undefined;
    this.#startTime = 0;
  }

  startTimer() {
    this.#startTime = Date.now();
  }

  displaySuiteStart(suite) {
    this.#currentSuite = { name: suite.name(), file: suite.locationPath(), tests: [] };
    this.#suites.push(this.#currentSuite);
  }

  displaySuccessResult(test) {
    this.#record(test, 'passed');
  }

  displaySkippedResult(test) {
    this.#record(test, 'skipped');
  }

  displayPendingResult(test) {
    this.#record(test, 'pending');
  }

  displayFailureResult(test, failType) {
    const status = failType === 'error' ? 'errored' : 'failed';
    this.#record(test, status, {
      message: this.internationalized(test.result().failureMessage()),
      location: this.internationalized(test.result().location()),
    });
  }

  displayRunnerEnd(runner) {
    const report = {
      tool: toolName,
      version: toolVersion,
      summary: {
        total: runner.totalCount(),
        passed: runner.successCount(),
        failed: runner.failuresCount(),
        errored: runner.errorsCount(),
        pending: runner.pendingCount(),
        skipped: runner.skippedCount(),
        durationMs: Date.now() - this.#startTime,
      },
      suites: this.#suites,
    };
    this.print(JSON.stringify(report));
  }

  #record(test, status, failure = undefined) {
    const entry = { name: test.name(), status };
    if (failure !== undefined) {
      entry.failure = failure;
    }
    this.#currentSuite.tests.push(entry);
  }
}
```

**Step 4: Run to verify pass**

Run: `node bin/testy_cli.js tests/ui/json_formatter_test.js`
Expected: PASS.

**Step 5: If Task 4 was done first without the `json` mapping, add it now**

Ensure `lib/ui/formatter_factory.js` imports `JsonFormatter` and includes `json: JsonFormatter` in the map. Re-run the factory tests:

Run: `node bin/testy_cli.js tests/ui/formatter_factory_test.js`
Expected: PASS.

**Step 6: Lint + commit**

Run: `npm run lint` → no errors.

```bash
git add lib/ui/json_formatter.js tests/ui/json_formatter_test.js lib/ui/formatter_factory.js
git commit -m "$(cat <<'EOF'
Add JsonFormatter emitting a single structured report (#380)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Configuration — `output` key, accessor, CLI flag, validation

Use @superpowers:test-driven-development.

**Files:**
- Modify: `lib/config/default_configuration.json`
- Modify: `lib/config/configuration.js`
- Modify: `lib/config/parameters_parser.js`
- Test: `tests/configuration/` (locate the existing configuration + parameters_parser tests and add cases alongside them)

**Step 1: Find the existing config tests**

Run: `ls tests/configuration` and open the parameters parser test file to mirror its style.

**Step 2: Write failing tests**

Add to the configuration test (mirroring how `language()` is tested):
```javascript
test('output defaults to console', () => {
  const configuration = new Configuration({}, { output: 'console' });
  assert.that(configuration.output()).isEqualTo('console');
});

test('output can be overridden by the user configuration', () => {
  const configuration = new Configuration({ output: 'tap' }, { output: 'console' });
  assert.that(configuration.output()).isEqualTo('tap');
});
```

Add to the parameters parser test (mirroring the `--language` cases):
```javascript
test('parses the --output flag with its value', () => {
  const result = ParametersParser.generateRunConfigurationFromParams(['--output', 'json']);
  assert.that(result).isEqualTo({ output: 'json' });
});

test('parses the -o short flag with its value', () => {
  const result = ParametersParser.generateRunConfigurationFromParams(['-o', 'tap']);
  assert.that(result).isEqualTo({ output: 'tap' });
});

test('rejects an unsupported output format', () => {
  assert.that(() => ParametersParser.generateRunConfigurationFromParams(['-o', 'nonsense']))
    .raises(/Invalid output format/);
});
```

**Step 3: Run to verify failure**

Run: `node bin/testy_cli.js tests/configuration/<parameters_parser_test_file>.js`
Expected: FAIL — `output()` undefined / flag not parsed.

**Step 4: Implement**

In `lib/config/default_configuration.json`, add `"output": "console"`:
```json
{
  "directory": "./tests",
  "filter": ".*_test.js$",
  "language": "en",
  "failFast": false,
  "randomOrder": false,
  "timeoutMs": 1000,
  "output": "console"
}
```

In `lib/config/configuration.js`, add the accessor next to `language()`:
```javascript
output() {
  return this.#configurationOptions.output;
}
```

In `lib/config/parameters_parser.js`:
- Add the identifier list near the others:
  ```javascript
  const OUTPUT_IDENTIFIERS = ['-o', '--output'];
  const SUPPORTED_OUTPUTS = ['console', 'tap', 'json'];
  ```
- In `sanitizeParameters`, add a line so `-o tap` is normalized like directory/extension:
  ```javascript
  sanitizedParams = this.findIndexAndSanitize(sanitizedParams, OUTPUT_IDENTIFIERS);
  ```
- In `generateRunConfigurationParameter`, add a parser to the list BEFORE `InvalidConfigurationParameter`:
  ```javascript
  new OutputConfigurationParameterParser(),
  ```
- Add the parser class at the bottom of the file:
  ```javascript
  class OutputConfigurationParameterParser {
    canHandle(consoleParam) {
      return ParametersParser.isParamWithArgument(consoleParam, OUTPUT_IDENTIFIERS);
    }

    handle(consoleParam) {
      const value = consoleParam.split(' ')[1];
      if (!SUPPORTED_OUTPUTS.includes(value)) {
        throw new ConfigurationParsingError(`Invalid output format "${value}". Supported formats: ${SUPPORTED_OUTPUTS.join(', ')}`);
      }
      return { output: value };
    }
  }
  ```

**Step 5: Run to verify pass**

Run: `node bin/testy_cli.js tests/configuration/<files>.js`
Expected: PASS.

**Step 6: Run the FULL suite (now that `configuration.output()` exists, the ConsoleUI wiring from Task 4 is exercised end-to-end)**

Run: `npm test`
Expected: PASS (entire self-test suite green, including `console_formatter_test`, `tap_formatter_test`, `json_formatter_test`, `formatter_factory_test`).

**Step 7: Lint + commit**

Run: `npm run lint` → no errors.

```bash
git add lib/config/default_configuration.json lib/config/configuration.js lib/config/parameters_parser.js tests/configuration
git commit -m "$(cat <<'EOF'
Add output configuration option and -o/--output CLI flag (#380)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Manual end-to-end check

Confirm the real CLI emits each format (not just unit tests).

**Step 1: TAP against the example tests**

Run: `node bin/testy_cli.js tests/examples -o tap`
Expected: output begins with `TAP version 13`, has `ok`/`not ok` lines, ends with `1..N` and `# ...` summary lines. No ANSI color codes, no separators/banners.

**Step 2: JSON**

Run: `node bin/testy_cli.js tests/examples -o json`
Expected: a single line of valid JSON. Verify it parses:

Run: `node bin/testy_cli.js tests/examples -o json | tail -1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(Object.keys(JSON.parse(s))))"`
Expected: prints `[ 'tool', 'version', 'summary', 'suites' ]`.

**Step 3: Default unchanged**

Run: `node bin/testy_cli.js tests/examples`
Expected: the usual human-readable colored output, identical to before this work.

> If any check fails, debug with @superpowers:systematic-debugging before proceeding.

---

## Task 8: Documentation

**Files:**
- Modify: `README.md`
- Modify: `README_es.md`

**Step 1: Document the config option**

In both READMEs, in the `.testyrc.json` configuration block, add the `output` option with the others:
```json
"output": "console"   // output format: "console" (human), "tap" or "json"
```

**Step 2: Document the CLI flag**

In the console-parameters list (where `-l`/`--language` etc. are listed), add:
- `-o format` or `--output format` where `format` is `console`, `tap`, or `json`. Defaults to `console`.

Translate the wording for `README_es.md`.

**Step 3: Add a short usage example**

Add a brief "Machine-readable output" subsection in `README.md` (and its Spanish equivalent) showing:
```sh
npx testy -o tap
npx testy -o json
```
with a one-line note that these are intended for agents/tools (TAP and JSON), while `console` stays the default for humans.

**Step 4: Commit**

```bash
git add README.md README_es.md
git commit -m "$(cat <<'EOF'
Document output formats (console/tap/json) (#380)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Final verification and push

**Step 1: Full suite + lint**

Run: `npm test` → PASS
Run: `npm run lint` → no errors

**Step 2: Push the branch**

```bash
git push -u origin 380-llm-friendly-output
```

**Step 3: Open the PR**

```bash
gh pr create --base main --head 380-llm-friendly-output \
  --title "feat: LLM-friendly output formats (TAP + JSON)" \
  --body "Implements #380. Adds an \`output\` config option and \`-o\`/\`--output\` CLI flag selecting \`console\` (default, unchanged), \`tap\`, or \`json\`. Introduces a polymorphic Formatter family (base + ConsoleFormatter/TapFormatter/JsonFormatter) selected by a FormatterFactory. Self-tested and documented.

Closes #380.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Out of scope (do NOT build)

- Pluggable custom reporter API.
- Writing output to a file (stdout only).
- Per-suite nesting in TAP (flat numbering is intentional).

## Known limitations to note in the PR (acceptable for v1)

- TAP failure `message:` collapses internal newlines to spaces (error stack traces become one line).
- An invalid `output` value coming from `.testyrc.json` (not the CLI) silently falls back to `console`, matching how `language` is handled today.
