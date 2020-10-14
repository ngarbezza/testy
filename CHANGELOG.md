# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Everything is released. Yay! :tada:

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
* [[feature] allow to mark tests as explicitly pending](https://github.com/ngarbezza/testy/issues/26): if you want to have a test 
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
- [Test with more than one assertion does not fail at first failure (#16)](https://github.com/ngarbezza/testy/issues/16)

## [3.0.0] - 2019-01-25

This is a release that breaks compatibility with previous ones. The assertion syntax changed completely to be more
readable and extensible. It also includes a huge internal refactor to make the tool easy to understand and debug.  

### Added
- [Fluent interface assert style (#13)](https://github.com/ngarbezza/testy/issues/13)

## [2.11.0] - 2019-01-20
### Added
- [Colored output (#8)](https://github.com/ngarbezza/testy/issues/8)
### Fixed
- [Handle equality assertion with circular dependencies (#2)](https://github.com/ngarbezza/testy/issues/2)
- [Fix pretty print of objects with circular dependencies (#4)](https://github.com/ngarbezza/testy/issues/4)

## [2.10.0] - 2019-01-18
### Added
- [Error result if test does not have assertions (#7)](https://github.com/ngarbezza/testy/issues/7)

## [2.9.1] - 2019-01-04
### Fixed
- [Return exit code 1 when tests fail or raise any error (#6)](https://github.com/ngarbezza/testy/issues/6)

## [2.9.0] - 2018-12-28
### Added
- [doesNotRaise(error), doesNotRaiseAnyErrors() (#1)](https://github.com/ngarbezza/testy/issues/1)
- [isNotEqualTo(object) (#5)](https://github.com/ngarbezza/testy/issues/5)

### Changed
- Fix passed count at test runner level (no reported issue)

[Unreleased]: https://github.com/ngarbezza/testy/compare/v5.0.2...HEAD
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
