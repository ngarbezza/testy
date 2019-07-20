# Testy

[![ci](https://img.shields.io/travis/ngarbezza/testy.svg)](https://travis-ci.org/ngarbezza/testy)
![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@pmoo/testy.svg)
![dependencies](https://img.shields.io/david/ngarbezza/testy.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/6b6e4d071471379f31e7/maintainability)](https://codeclimate.com/github/ngarbezza/testy/maintainability)
![package-size](https://img.shields.io/bundlephobia/min/@pmoo/testy.svg)
![downloads](https://img.shields.io/npm/dt/@pmoo/testy.svg)
![activity](https://img.shields.io/github/commit-activity/w/ngarbezza/testy.svg)
![release-date](https://img.shields.io/github/release-date/ngarbezza/testy.svg)

A very simple JS testing library, for educational purposes. Live at npm at [@pmoo/testy](https://www.npmjs.com/package/@pmoo/testy).

## Installation

`npm install --save-dev @pmoo/testy`

## Usage

### Running a single file

```javascript
const { suite, test, assert } = require('@pmoo/testy');

suite('a boring test suite', () => {
  test('true is obviously true', () => assert.isTrue(true))
}).run();
```

(notice the `run()` at the end)

### Running tests from a folder

```javascript
const { Testy } = require('@pmoo/testy');

Testy.configuredWith({
  // Absolute path. Resolved by 'path' module
  directory: require('path').resolve('./tests'),
  // 'en' is the default. For example, you can try 'es' to see output in Spanish
  language: 'en',
  // Stops at the first failed or errored test. false by default
  failFast: false,
}).run();
```

And it will run every file under the `tests` directory, and you can define suites in those files.

In this case, make sure suites don't have the `run()` at the end, otherwise they are going to be executed twice.

### Examples and available assertions

* Boolean assertions:
  * `assert.that(boolean).isTrue()` or `assert.isTrue(boolean)`. It does a strict comparison against `true` (`object === true`)
  * `assert.that(boolean).isFalse()` or `assert.isFalse(boolean)`. It does a strict comparison against `false` (`object === false`)
* Equality assertions:
  * `assert.that(actual).isEqualTo(expected)` or `assert.areEqual(actual, expected)`.
  * `assert.that(actual).isNotEqualTo(expected)` or `assert.areNotEqual(actual, expected)`
  * Equality assertions use a deep object comparison (based on Node's `assert` module) and fail if objects under comparison have circular references.
  * Equality criteria on non-primitive objects can be specified:
    * Passing an extra two-arg comparator function to `isEqualTo(expected, criteria)` or `areEqual(actual, expected, criteria)`
    * Passing a method name that `actual` object understands: `isEqualTo(expected, 'myEqMessage')` or `areEqual(actual, expected, 'myEqMessage')`
    * By default, if `actual` has an `equals` method it will be used.  
* Exception testing:
  * `assert.that(() => { ... }).raises(error)`
  * `assert.that(() => { ... }).doesNotRaise(error)`
  * `assert.that(() => { ... }).doesNotRaiseAnyErrors()`
* Array inclusion:
  * `assert.that(collection).includes(object)`
  * `assert.that(collection).includesExactly(...objects)`

Please take a look at the `tests` folder, you'll find examples of each possible test you can write.

## Why?

Why another testing library? The main reason is that we want to keep simplicity, something it's hard to see in the main testing tools out there.

* **Less dependencies:** right now, we depend on just one npm package, making the library easy to install and avoiding conflict with other dependencies. This is also good for installing on places where the internet connection is not good and we don't want to download hundreds of libraries.
* **Understandable object-oriented code:** we want to use this tool for teaching, so eventually we'll look at the code during lessons, and students should be able to see what is going on, and even contributing at it, with no dark magic involved. Also, we try to follow good OO practices.
* **Unique set of features:** we are not following any specification nor trying to copy behavior from other approaches (like the "xUnit" or "xSpec" way).  

## Contributing

Please take a look at the [Contributing section](CONTRIBUTING.md).
