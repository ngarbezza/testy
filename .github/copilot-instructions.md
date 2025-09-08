# Testy - JavaScript Testing Framework

Testy is a minimal JavaScript testing framework for educational purposes, written in Node.js ES modules. It is self-tested and distributed as an npm package with zero dependencies.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Setup and Installation
- Install Node.js 20.x or higher (project supports 20.x, 22.x, 24.x)
- Run `npm install` -- takes ~5 seconds. NEVER CANCEL.
- Permission fix required after clone: `chmod +x bin/testy_cli.js`

### Build and Test Commands
- `npm run lint` -- runs ESLint, takes ~2 seconds. NEVER CANCEL.
- `npm run test` -- runs self-tests with testy framework, takes ~1 second, processes 359 tests. NEVER CANCEL.
- `npm run test:coverage` -- runs tests with c8 coverage, takes ~9 seconds, shows 97%+ coverage. NEVER CANCEL. Set timeout to 30+ seconds.
- `npm run jsdoc` -- generates API documentation, takes ~5 seconds. NEVER CANCEL.

### CLI Usage
- `npx testy` -- runs all tests in ./tests directory with .*_test.js$ filter
- `npx testy <file>` -- runs specific test file
- `npx testy --help` -- shows help and available options
- `npx testy --version` -- shows version (currently 8.0.0)
- `npx testy --fail-fast` or `-f` -- stops on first failure
- `npx testy --randomize` or `-r` -- runs tests in random order
- `npx testy --language es` or `-l es` -- sets Spanish language (supports en/es/it)
- `npx testy --directory <path>` or `-d <path>` -- sets test directory
- `npx testy --extension <filter>` or `-e <filter>` -- sets file filter

### Playground Commands
- `npm run playground:reset` -- creates playground_test.js from template
- `npm run playground:run` -- runs the playground file
- `npm run playground:clear` -- removes playground file

### Important File Naming Convention
Test files MUST end with `_test.js` to be discovered by testy. Files without this suffix will be ignored with a warning: "Make sure your files matches the .*_test.js$ naming filter."

## Validation

### Manual Testing Requirements
ALWAYS validate testy functionality by creating and running test scenarios:

1. Create a test file ending in `_test.js`
2. Use the import: `import { suite, test, assert } from './lib/testy.js'` (relative to repo root)
3. Write a suite with multiple test types:
   - Basic assertions: `assert.that(1 + 1).isEqualTo(2)`
   - String assertions: `assert.that('hello').matches(/hello/)`
   - Array assertions: `assert.that([1, 2, 3]).includes(2)`
   - Boolean assertions: `assert.that(true).isTrue()`
4. Run with `npx testy <your_test_file.js>`
5. Verify output shows test results and timing

### Required Validation Steps
- ALWAYS run `npm run lint` and `npm run test` before making changes
- ALWAYS test CLI functionality with multiple options (--help, --version, specific files)
- ALWAYS test at least one complete user scenario after making changes
- ALWAYS verify test file naming convention requirements

### CI Validation
- GitHub Actions CI runs on Node.js 20.x, 22.x, 24.x
- Pipeline: `npm install` → `npm run lint` → `npm run test`
- Coverage and code quality analysis runs on Node.js 20.x only
- ALWAYS run `npm run lint` before committing or CI will fail

## Project Structure

### Key Directories and Files
```
/home/runner/work/testy/testy/
├── bin/testy_cli.js              # Main CLI executable
├── lib/                          # Core library code
│   ├── testy.js                  # Main API exports (assert, suite, test, etc.)
│   ├── core/                     # Core testing framework
│   ├── ui/                       # Console UI and formatting
│   ├── utils/                    # Utility functions
│   ├── config/                   # Configuration handling
│   └── i18n/                     # Internationalization
├── tests/                        # Self-tests
│   ├── core/                     # Core framework tests
│   ├── examples/                 # Example test files
│   ├── configuration/            # Config tests
│   └── utils/                    # Utility tests
├── config/                       # Build tool configurations
│   ├── eslint.config.js          # ESLint configuration
│   ├── jsdoc.json               # JSDoc configuration
│   └── stryker.conf.json        # Mutation testing (may not work)
├── .testyrc.json                # Default testy configuration
├── package.json                 # npm package definition
└── .github/workflows/           # CI/CD pipelines
```

### Configuration
- `.testyrc.json` -- main configuration file with directory, filter, language, failFast, randomOrder, timeoutMs settings
- `config/eslint.config.js` -- strict ESLint rules with complexity limits
- Configuration can be overridden via CLI options

## Common Tasks

### Writing Tests
```javascript
import { suite, test, assert, before, after } from './lib/testy.js';

suite('example suite', () => {
  before(() => {
    // Setup code
  });

  test('example test', () => {
    assert.that(42).isEqualTo(42);
    assert.that('hello').matches(/hello/);
    assert.that([1, 2, 3]).includes(2);
    assert.that(true).isTrue();
  });

  after(() => {
    // Cleanup code
  });
});
```

### Available Assertions
- Boolean: `isTrue()`, `isFalse()`
- Equality: `isEqualTo()`, `isNotEqualTo()`
- Identity: `isIdenticalTo()`, `isNotIdenticalTo()`
- Null/Undefined: `isNull()`, `isNotNull()`, `isUndefined()`, `isNotUndefined()`
- Numeric: `isGreaterThan()`, `isLessThan()`, `isNearTo()`
- String: `matches(regex)`
- Collections: `includes()`, `doesNotInclude()`, `includesExactly()`, `isEmpty()`, `isNotEmpty()`
- Exceptions: `raises()`, `doesNotRaise()`, `doesNotRaiseAnyErrors()`

### Special Test Features
- Pending tests: test without body shows as `[WIP]`
- Skipped tests: `.skip()` after test declaration
- Exclusive tests: `.only()` to run only marked tests
- Async support: use `async`/`await` in test functions

### Language Support
- English (en) - default
- Spanish (es) - test output in Spanish
- Italian (it) - test output in Italian

### Known Issues
- Mutation testing may fail with permission errors on `bin/testy_cli.js`
- Some npm scripts require external tools (graphviz, etc.) that may not be available
- Playground template has incorrect import path in template - fix to use relative path

### Development Notes
- Use `npm t` instead of `npx testy` for testing local changes
- The framework is self-tested (uses itself to run its own tests)
- Zero dependencies policy - no external npm dependencies in production
- ES modules only - no CommonJS support
- Educational focus - code is designed to be readable and teachable

### Architectural Decisions
See `doc/decisions/` for detailed ADR records covering:
- Zero dependencies policy
- ES modules only support
- Avoiding test doubles
- Node.js version support policy
- Technical documentation standards