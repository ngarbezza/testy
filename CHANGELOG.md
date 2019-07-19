# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Everything is released. Yay!

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

[Unreleased]: https://github.com/ngarbezza/testy/compare/v4.0.1...HEAD
[4.0.0]: https://github.com/ngarbezza/testy/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/ngarbezza/testy/compare/v3.1.1...v4.0.0
[3.1.1]: https://github.com/ngarbezza/testy/compare/v3.0.1...v3.1.1
[3.0.1]: https://github.com/ngarbezza/testy/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/ngarbezza/testy/compare/v2.11.0...v3.0.0
[2.11.0]: https://github.com/ngarbezza/testy/compare/v2.10.0...v2.11.0
[2.10.0]: https://github.com/ngarbezza/testy/compare/v2.9.1...v2.10.0
[2.9.1]: https://github.com/ngarbezza/testy/compare/v2.9.0...v2.9.1
[2.9.0]: https://github.com/ngarbezza/testy/compare/v2.8.1...v2.9.0
