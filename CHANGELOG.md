# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Everything is released :tada:

## [7.1.0] - 2024-05-23

Some achievements to celebrate this release: 100 closed issues and 14 contributors (1 new!)

### Added

* [[feature] Add numeric assertions for numerical comparisons](https://github.com/ngarbezza/testy/issues/286): now we
  have more semantic assertions to compare numbers, check out the readme/jsdoc for more info. Thank you,
  [@beluamat29](https://github.com/beluamat29), for your first contribution! :tada:

### Fixed

* [[bug] passing tests even if the objects under comparison are not equal](https://github.com/ngarbezza/testy/issues/285):
  this was a regression from a refactoring to add private methods in v7, it's not user-facing error. 

## [7.0.2] - 2024-03-04

### Fixed

* [[bug] async test results mixup](https://github.com/ngarbezza/testy/issues/275). Thank
you, [@mellster2012](https://github.com/mellster2012), for your first contribution! :tada:

## [7.0.1] - 2024-02-12

### Fixed

* [[bug] timer is gone](https://github.com/ngarbezza/testy/issues/272): We restored the timer at the end of the test
report. 

## [7.0.0] - 2024-02-05

### Breaking changes

* :boom: We migrated from CommonJS to ES Modules. This was a heavy change, and it will affect all the users, but we
think it is the right step to go to support modern Node versions. Unfortunately, due to complexity generating the
package, CommonJS will not be supported.ADR `#0013` was added with more info about this decision.

* :boom: Node 18.x or higher is required. Support for Node 12.x, 14.x and 16.x has dropped. Support for Node 20.x is
added. [Commit](https://github.com/ngarbezza/testy/commit/b8e62c11321b92bd4bc136293db815de7a554668)

### Added

* [[docs] API docs using JSDoc](https://github.com/ngarbezza/testy/issues/231): all public methods and some internal
ones are now documented, most of them with simple and easy to understand examples. This conforms a documentation
more extensive than the README.

* [[feature] report source code location on failed/errored tests](https://github.com/ngarbezza/testy/issues/52): if your
test fails or raises an unexpected error, you'll now see a reference with the failed assertion so it's easier to debug
tests with multiple assertions. The line is displayed next to the test name and failure message.

* [[feature] configurable per test timeout](https://github.com/ngarbezza/testy/issues/255): we have a new configuration
value, `timeoutMs` and it makes tests to end with error state if they are not executed within that timeout.

* [[feature] Improve feedback for wrong usage of raises()](https://github.com/ngarbezza/testy/issues/264): if any of
the exception assertions is called with an actual object that is not a function, it will return a translated message
with better feedback explaining it is invalid. The test is considered error instead of failure.

### Fixed

* [[bug] exit code 0 and no tests run when a promise is not settled](https://github.com/ngarbezza/testy/issues/253): bug
that motivated the addition of the timeout feature. Now if you have tests that for some reason do not resolve or reject
their promises, the tool will give you feedback about that.

* [[bug] failFast configuration parameter should fail if an invalid value is provided](https://github.com/ngarbezza/testy/issues/203),
thank you [@ignacio-r](https://github.com/ignacio-r) for your first contribution! :tada:

### Other changes

* The tool now has incorporated mutation testing to the development workflow. We expect to keep increasing code quality!
* Internal file reorganization to facilitate development tasks and have less directories.
* Added [MendRenovate](https://www.mend.io/free-developer-tools/renovate/) to keep our CI dependencies up to date.

## [6.1.0] - 2022-07-13

### Added

* [[feature] support for asynchronous tests](https://github.com/ngarbezza/testy/issues/106), thank you
[@JavierGelatti](https://github.com/JavierGelatti) for the [initial implementation](https://github.com/ngarbezza/testy/pull/82)!
Now we can use `async`/`await` in test definitions.

### Fixed

* [[bug] before() and after() argument is not validated](https://github.com/ngarbezza/testy/issues/227)

* [[bug] multiple before() or after() empty blocks can be added to a test suite](https://github.com/ngarbezza/testy/issues/202)

* [[bug] swallowed/not precise exception when before() or after() fails](https://github.com/ngarbezza/testy/issues/230)

### Other changes

* Updates to the dev tools: eslint, github actions, code climate
* Added [10Pines](https://10pines.com) as sponsor: thanks for the support!

## [6.0.0] - 2021-11-21

### Breaking changes

* :boom: Node 12.x or higher is required. Support for Node 8.x and 10.x has dropped.
There is now an architectural decision record to specify how support will work
going forward. [#214](https://github.com/ngarbezza/testy/issues/214)

### Added

* [[feature] isIdenticalTo() / isNotIdenticalTo() assertions](https://github.com/ngarbezza/testy/issues/182), thank you @franciscojaimesfreyre, for your first contribution!
* [[feature] better error reporting when loading test suite files](https://github.com/ngarbezza/testy/issues/184)
* [[docs] italian translations](https://github.com/ngarbezza/testy/issues/198), thank you @giovannipessiva for your first contribution!

### Fixed

* [[bug] isNotEqualTo does not have expected behaviour when both parts are undefined](https://github.com/ngarbezza/testy/issues/191), thank you, @franciscojaimesfreyre, for reporting and fixing this bug!
* [[bug] pretty print logic not giving details after depth 2](https://github.com/ngarbezza/testy/issues/188)
* [[bug] null values in isEqualTo comparison fail with error](https://github.com/ngarbezza/testy/issues/217)

### Other improvements and cleanups

* We now have a PR template :tada:
* The branching model was simplified (before: `your-branch` -> `develop` -> `main`, now: `your-branch` -> `main`)
* Test coverage was increased
* Lint rules have been updated and now we check the code with ESLint v7

## [5.1.0] - 2021-01-13

This release includes a lot of contributions (4 new contributors!), and several refactorings to continue improving the quality of the tool.

### Added

* [[feature] added after() hook to run code after each test](https://github.com/ngarbezza/testy/issues/135), thank you @adico1!
* [[feature] isIncludedIn() and isNotIncludedIn() assertions](https://github.com/ngarbezza/testy/issues/75), thank you @ask-imran for your first contribution!
* [[feature] warning message when no tests found](https://github.com/ngarbezza/testy/issues/157), thank you @niyonx for your first contribution!
* [[feature] show error when a requested file does not exist](https://github.com/ngarbezza/testy/issues/158), thank you @chelsieng for your first contribution!
* [[feature] global error handler](https://github.com/ngarbezza/testy/issues/177)

### Fixed

* [[bug] suite and test names cannot be empty](https://github.com/ngarbezza/testy/issues/136), thank you @ask-imran!
* [[bug] includes() and doesNotInclude() matchers only work on Arrays](https://github.com/ngarbezza/testy/issues/130), thank you @trochepablo for your first contribution!
* [[bug] color for pending summary was not painted](https://github.com/ngarbezza/testy/issues/173)
* [[bug] it was possible to mark tests as pending without specifying reason](https://github.com/ngarbezza/testy/issues/172)

### Refactored

* [rename "master" branch to "main"](https://github.com/ngarbezza/testy/issues/133); also, an ADR was added to track the decision that we want a better vocabulary
* [parametrizable i18n messages](https://github.com/ngarbezza/testy/issues/71)
* [write more tests for the i18n module](https://github.com/ngarbezza/testy/issues/179)
* [throw error objects instead of strings](https://github.com/ngarbezza/testy/issues/176)
* [speed up tests by not creating error messages on successful assertions](https://github.com/ngarbezza/testy/commit/531d1d6360c93a3aae2f11bd0c957c45e93cd35c)
* [added some npm scripts for test coverage and dependencies graph](https://github.com/ngarbezza/testy/commit/d4ca1fa7804b2353458eb214d1f302fefc9fed9d)
* [changes in modularization: extract assertion and test result reporter](https://github.com/ngarbezza/testy/commit/4913b5a187bc0700b3de4b5b1a9adc0e2a8dc57e)
* add more tests and increased the current coverage ([example 1](https://github.com/ngarbezza/testy/commit/be41db9872ea4490b5dae238d6c553b214667326), [example 2](https://github.com/ngarbezza/testy/commit/28b2ee51078300382c7398cb40203d6e40ca26d1))
* formatter object decoupled from console ui (ADR 0004 added [here](https://github.com/ngarbezza/testy/commit/9ab5c55fd4738054effef1e1aab15824a62c6750))
* avoid test doubles at all (ADR 0005 added [here](https://github.com/ngarbezza/testy/commit/5a65fbc6e6e58b1f03f996c381240d4a1b8c3875)), removed test runner double

... and more minor cleanups.

## [5.0.2] - 2020-10-13

A hacktoberfest release! 5 bugs fixed and two new contributors! :muscle:

It also includes an improvement in the contribution guidelines, and records of architectural decisions (ADRs).

### Fixed

* [[bug] isEmpty / isNotEmpty failing when passing an undefined value](https://github.com/ngarbezza/testy/issues/125): thank you, @abraaoduarte for your first contribution!
* [[bug] validate argument types of test()](https://github.com/ngarbezza/testy/issues/137): thank you, @adico1 for your first contribution!
* [[bug] raises() does not pass when throwing a non-primitive object](https://github.com/ngarbezza/testy/issues/140)
* [[bug] toString() is not honored when printing objects](https://github.com/ngarbezza/testy/issues/143)
* [[bug] cannot run testy binary using npx](https://github.com/ngarbezza/testy/issues/148)

## [5.0.1] - 2020-08-02

### Fixed

* [[bug] includesExactly uses === as comparison](https://github.com/ngarbezza/testy/issues/119): Now the same criteria as `isEqualTo` is used in `includes`, `doesNotInclude` and `includesExactly`.

## [5.0.0] - 2020-05-22

:five: :tada: new release! Including some **breaking changes**.

### Breaking changes

* There's no need for a testy runner file, now there's a testy binary that runs the suites for you based on a configuration file. In other words, before: you have to call testy; now: testy calls you :smiley:
* Node 6.x is no longer supported. Now Node 8.x is the minimum version required.

### Added

* [[feature] configuration to run tests in random order](https://github.com/ngarbezza/testy/issues/73): to ensure test isolation and therefore having robust suites :muscle:
* [[feature] allow to pass multiple test paths to run testy](https://github.com/ngarbezza/testy/issues/86): this allows to have more flexibility and control which files we want to run
* [[documentation] docs in Spanish](https://github.com/ngarbezza/testy/issues/90): now both README and CONTRIBUTING files are translated and updated in English and Spanish.
* [[feature] testy binary](https://github.com/ngarbezza/testy/issues/17): **breaking change**, this makes testy more easy to be executed. There's a `testy` script that can be run globally or through `npx`.
* [[feature] read configuration parameters from JSON file](https://github.com/ngarbezza/testy/issues/94): in order to run testy from a binary file, we now need a place to specify the configuration. Starting on v5, every project can have a `.testyrc.json` with the desired configuration parameters. Default values will be used in case the file is not present.
* [[feature] testy start message](https://github.com/ngarbezza/testy/issues/100): now testy says "Hi!" when starting to run tests.
* [[documentation] v5 revamped docs](https://github.com/ngarbezza/testy/issues/91): new README with all the v5 features, and a more clear step by step guide. Also, there are links for v4 docs. Spanish and English.
* [[feature] -h/--help command line option](https://github.com/ngarbezza/testy/issues/108): now that we have a binary, we need a help option! Added a simple.
* [[feature] -v/--version command line option](https://github.com/ngarbezza/testy/issues/109): simple text displaying the current version.
* [[feature] isNull() and isNotNull() assertions](https://github.com/ngarbezza/testy/issues/66): checking for null now has a specific assertion with a helpful error message.
* [[feature] matches() assertion](https://github.com/ngarbezza/testy/issues/113): other important assertion added to the core; check if a string matches a regex (or another string!).

### Changed

* [version] Node 8.x is the minimum version (**breaking change**)
* [[internal] use eslint as linter for the tool](https://github.com/ngarbezza/testy/issues/89): this is a good step forward having more consistency in this codebase.
* [documentation] add documentation issue type: keeping the repo more accessible for contributors.
* [documentation] explain how CI and our linter works: helpful for contributors

### Fixed

* [[bug] make name and body required for test suites](https://github.com/ngarbezza/testy/issues/84)
* [[bug] isEmpty and isNotEmpty now work with Set instances](https://github.com/ngarbezza/testy/issues/111)

## [4.4.0] - 2020-01-14

First release in 2020! Release emoji: :muscle:

### Added

* [[feature] isUndefined() and isNotUndefined() assertions](https://github.com/ngarbezza/testy/issues/74): Thank you [@JavierGelatti](https://github.com/JavierGelatti)!
* [[feature] comparing undefined with undefined should fail](https://github.com/ngarbezza/testy/issues/65): a feature for preventing false positives
* [[feature] isNearTo() assertion](https://github.com/ngarbezza/testy/issues/67): `0.1 + 0.2` is not a problem anymore :)
* [[feature] allow to mark tests as explicitly pending](https://github.com/ngarbezza/testy/issues/26)
* [documentation] Add refactoring issue type for better reporting of potential refactorings

### Changed

* [[ui] Improve styles of test suite report](https://github.com/ngarbezza/testy/pull/79): Thank you [@JavierGelatti](https://github.com/JavierGelatti)!
* [documentation] Improved README:
  * Make a more guided setup with recommendations and concrete examples
  * Add all the available assertions
  * Describe what we call a suite and what a test
  * Add section to explain `before()` helper
* [infrastructure] Removed Travis CI support. Builds are executed only by Github Actions now.
* [refactoring] Centralized utility functions in a single module

### Fixed

* [[bug] poor message in equality assertion when comparing against null/undefined](https://github.com/ngarbezza/testy/issues/63)

## [4.3.0] - 2019-11-10

Release emoji: :open_file_folder:

### Added

* [[feature] runTesty with a relative path](https://github.com/ngarbezza/testy/issues/14)
* [[feature] ability to run a single file without `run()`](https://github.com/ngarbezza/testy/issues/54)
* Contributors section: from now on we'll be thanking all of our contributors using [allcontributors.org](https://allcontributors.org)

### Fixed

* [[bug] includesExactly() does not work with Set](https://github.com/ngarbezza/testy/issues/58)

## [4.2.2] - 2019-10-11

Release emoji: :dancers:

### Fixed

* [isEqualTo() using equals or custom property does not work if the objects are instances of a class](https://github.com/ngarbezza/testy/issues/49)

## [4.2.1] - 2019-10-10

Release emoji: :six:

### Fixed

* [Support for Node 6.x](https://github.com/ngarbezza/testy/issues/46)

## [4.2.0] - 2019-10-09

Release emoji :heavy_plus_sign:

### Added

* [Allow to pass a regex to the raises() matcher](https://github.com/ngarbezza/testy/issues/39)
* [New matcher: doesNotInclude()](https://github.com/ngarbezza/testy/issues/38)

### Fixed

* [Poor error message when custom equality method is not found](https://github.com/ngarbezza/testy/issues/35): Thank you, [@TomerPacific](https://github.com/@TomerPacific)!

## [4.1.1] - 2019-10-05

Release emoji: :zero:

### Added

* [Failures summary section](https://github.com/ngarbezza/testy/issues/31): Now at the end of the console output, we should see (in case there are failures or errors) a summary so you don't have to scroll up to find the problems!
* [New matchers: isEmpty(), isNotEmpty()](https://github.com/ngarbezza/testy/issues/34). Now strings and arrays can be tested using these matchers.

### Changed

* [Remove `require-dir` dependency](https://github.com/ngarbezza/testy/issues/36): Zero dependencies goal reached! :muscle:
* [Increased "debuggability"](https://github.com/ngarbezza/testy/issues/33): Nobody should be afraid of debugging inside the code of this tool! If something is not understandable, let's change it.

## [4.0.1] - 2019-07-19

A round of bugfixes on the last major release.

### Fixed

* [Running suites with run() fail because of unitialized fail fast mode](https://github.com/ngarbezza/testy/issues/29)
* [Suite with no body fails](https://github.com/ngarbezza/testy/issues/30)

## [4.0.0] - 2019-04-11

Major release! Including breaking changes.

### Changed

* [Change `runTesty` to be more object-oriented](https://github.com/ngarbezza/testy/issues/27). This deprecates the `runTesty` function way of configuring Testy. README is up to date with the new configuration way.
* [Deprecate context object passed to before() blocks](https://github.com/ngarbezza/testy/issues/23). Tests using this feature will break from now on.

### Added

* [Include actual error description in failure message when an exception is expected but another is raised](https://github.com/ngarbezza/testy/pull/22), thank you [@JavierGelatti](https://github.com/JavierGelatti)!
* [Prevent definition of multiple before() blocks](https://github.com/ngarbezza/testy/issues/24)
* [Multilanguage support](https://github.com/ngarbezza/testy/issues/25). Includes English and Spanish translations
* [Fail-Fast mode](https://github.com/ngarbezza/testy/issues/9). This adds a new possible test result which is Skipped.

## [3.1.1] - 2019-02-21

Continuing improving some assertions.

### Added

* [Equality message to use on isEqualTo and isNotEqualTo (#15)](https://github.com/ngarbezza/testy/issues/15)
* [Matcher: includesExactly (#18)](https://github.com/ngarbezza/testy/issues/18)

## [3.0.1] - 2019-02-19

A very important bugfix!

### Fixed

* [Test with more than one assertion does not fail at first failure (#16)](https://github.com/ngarbezza/testy/issues/16)

## [3.0.0] - 2019-01-25

This is a release that breaks compatibility with previous ones. The assertion syntax changed completely to be more
readable and extensible. It also includes a huge internal refactor to make the tool easy to understand and debug.

### Added

* [Fluent interface assert style (#13)](https://github.com/ngarbezza/testy/issues/13)

## [2.11.0] - 2019-01-20

### Added

* [Colored output (#8)](https://github.com/ngarbezza/testy/issues/8)

### Fixed

* [Handle equality assertion with circular dependencies (#2)](https://github.com/ngarbezza/testy/issues/2)
* [Fix pretty print of objects with circular dependencies (#4)](https://github.com/ngarbezza/testy/issues/4)

## [2.10.0] - 2019-01-18

### Added

* [Error result if test does not have assertions (#7)](https://github.com/ngarbezza/testy/issues/7)

## [2.9.1] - 2019-01-04

### Fixed

* [Return exit code 1 when tests fail or raise any error (#6)](https://github.com/ngarbezza/testy/issues/6)

## [2.9.0] - 2018-12-28

### Added

* [doesNotRaise(error), doesNotRaiseAnyErrors() (#1)](https://github.com/ngarbezza/testy/issues/1)
* [isNotEqualTo(object) (#5)](https://github.com/ngarbezza/testy/issues/5)

### Changed

* Fix passed count at test runner level (no reported issue)

[Unreleased]: https://github.com/ngarbezza/testy/compare/v7.1.0...HEAD
[7.1.0]: https://github.com/ngarbezza/testy/compare/v7.0.2...v7.1.0
[7.0.2]: https://github.com/ngarbezza/testy/compare/v7.0.1...v7.0.2
[7.0.1]: https://github.com/ngarbezza/testy/compare/v7.0.0...v7.0.1
[7.0.0]: https://github.com/ngarbezza/testy/compare/v6.1.0...v7.0.0
[6.1.0]: https://github.com/ngarbezza/testy/compare/v6.0.0...v6.1.0
[6.0.0]: https://github.com/ngarbezza/testy/compare/v5.1.0...v6.0.0
[5.1.0]: https://github.com/ngarbezza/testy/compare/v5.0.2...v5.1.0
[5.0.2]: https://github.com/ngarbezza/testy/compare/v5.0.1...v5.0.2
[5.0.1]: https://github.com/ngarbezza/testy/compare/v5.0.0...v5.0.1
[5.0.0]: https://github.com/ngarbezza/testy/compare/v4.4.0...v5.0.0
[4.4.0]: https://github.com/ngarbezza/testy/compare/v4.3.0...v4.4.0
[4.3.0]: https://github.com/ngarbezza/testy/compare/v4.2.2...v4.3.0
[4.2.2]: https://github.com/ngarbezza/testy/compare/v4.2.1...v4.2.2
[4.2.1]: https://github.com/ngarbezza/testy/compare/v4.2.0...v4.2.1
[4.2.0]: https://github.com/ngarbezza/testy/compare/v4.1.1...v4.2.0
[4.1.1]: https://github.com/ngarbezza/testy/compare/v4.0.1...v4.1.1
[4.0.1]: https://github.com/ngarbezza/testy/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/ngarbezza/testy/compare/v3.1.1...v4.0.0
[3.1.1]: https://github.com/ngarbezza/testy/compare/v3.0.1...v3.1.1
[3.0.1]: https://github.com/ngarbezza/testy/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/ngarbezza/testy/compare/v2.11.0...v3.0.0
[2.11.0]: https://github.com/ngarbezza/testy/compare/v2.10.0...v2.11.0
[2.10.0]: https://github.com/ngarbezza/testy/compare/v2.9.1...v2.10.0
[2.9.1]: https://github.com/ngarbezza/testy/compare/v2.9.0...v2.9.1
[2.9.0]: https://github.com/ngarbezza/testy/compare/v2.8.1...v2.9.0
