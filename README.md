# Testy

![ci](https://img.shields.io/github/workflow/status/ngarbezza/testy/Node%20CI/develop?logo=github)
\
[![maintainability](https://img.shields.io/codeclimate/maintainability/ngarbezza/testy?logo=code-climate)](https://codeclimate.com/github/ngarbezza/testy)
[![tech-debt](https://img.shields.io/codeclimate/tech-debt/ngarbezza/testy?logo=code-climate)](https://codeclimate.com/github/ngarbezza/testy)
[![coverage](https://img.shields.io/codeclimate/coverage/ngarbezza/testy?logo=code-climate)](https://codeclimate.com/github/ngarbezza/testy)
\
![open-issues](https://img.shields.io/github/issues-raw/ngarbezza/testy?logo=github)
![closed-issues](https://img.shields.io/github/issues-closed-raw/ngarbezza/testy?logo=github)
![open-prs](https://img.shields.io/github/issues-pr-raw/ngarbezza/testy?logo=github)
 \
![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@pmoo/testy.svg?logo=npm)
![downloads](https://img.shields.io/npm/dt/@pmoo/testy.svg?logo=npm)
![dependencies](https://img.shields.io/david/ngarbezza/testy.svg?logo=dependabot)
\
![package-size](https://img.shields.io/bundlephobia/min/@pmoo/testy.svg?logo=npm)
![activity](https://img.shields.io/github/commit-activity/w/ngarbezza/testy.svg?logo=npm)
![release-date](https://img.shields.io/github/release-date/ngarbezza/testy.svg?logo=npm)
\
[![all-contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?logo=open-source-initiative)](#contributors)

A very simple JS testing framework, for educational purposes. Live at npm at [@pmoo/testy](https://www.npmjs.com/package/@pmoo/testy).

:arrow_right: [v4 (legacy version) documentation here](README_v4.md) \
:arrow_right: [Documentación en español aquí](README_es.md)

## Getting started

`npm install --save-dev @pmoo/testy` (if you use [npm](https://www.npmjs.com/)) \
`yarn add --dev @pmoo/testy` (if you use [yarn](https://classic.yarnpkg.com/en/))

**Supported Node versions**: 8.x or higher

## Usage

### Writing test suites

A test suite is a file ending `_test.js` that looks like this:

```javascript
// my_test.js
const { suite, test, assert } = require('@pmoo/testy');

suite('a boring test suite', () => {
  test('42 is 42, not surprising', () => {
    assert.that(42).isEqualTo(42);
  });
});
```

A test suite represents a grouping of tests, and it is implemented as a function call to `suite` passing a name and a zero-argument function, which is the suite body.

A test is implemented as a function call to `test()`, passing a name and the test body as a zero-argument function. 

Inside the test you can call different assertions that are documented in detail later on.

### Running Testy

You can run an individual test file using:

```
$ npx testy my_test.js 
```

Or, you can run it without arguments to run all the tests (by default it looks on a `tests` folder located in the project root):

```
$ npx testy 
```

You can also add it as the `test` script for npm/yarn in your `package.json`:

```
{
  ...
  "scripts": {
    "test": "npx testy"
  },
  ...
}
```

And then run the tests using `npm test` or `yarn test`.

### Configuring Testy

Testy will look for a `.testyrc.json` configuration file in the project root directory. You can use this configuration as a template (values here are the defaults):

```
{
  "directory": "./tests",   // directory including your test files
  "filter": ".*_test.js$",  // which convention to use to recognize test files
  "language": "en",         // language of the output messages. "es" and "en" supported for now
  "failFast": false,        // enable/disable fail fast mode (stop as soon as a failed test appears)
  "randomOrder": false      // enable/disable execution of tests in random order
}
```

These are all the configuration parameters you can set. Feel free to change it according to your needs.
When declaring this configuration, every test suite under the `tests` directory (matching files ending with `*test.js`) will be executed.

### Examples and available assertions

There must be at least one assertion on the test to be valid. These are all the supported assertion types:

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
    * If we compare `undefined` with `undefined` using `isEqualTo()`, it will make the test fail. For explicit check for `undefined`, use the `isUndefined()`/`isNotUndefined()` assertions documented above. 
* Check for `undefined` presence/absence:
  * `assert.that(aValue).isUndefined()` or `assert.isUndefined(aValue)`
  * `assert.that(aValue).isNotUndefined()` or `assert.isNotUndefined(aValue)`
* Check for `null` presence/absence:
  * `assert.that(aValue).isNull()` or `assert.isNull(aValue)`
  * `assert.that(aValue).isNotNull()` or `assert.isNotNull(aValue)`
* Exception testing:
  * `assert.that(() => { ... }).raises(error)` or with regex `.raises(/part of message/)`
  * `assert.that(() => { ... }).doesNotRaise(error)`
  * `assert.that(() => { ... }).doesNotRaiseAnyErrors()`
* Numeric assertions:
  * `assert.that(aNumber).isNearTo(anotherNumber)`. There's a second optional argument that indicates the number of digits to be used for precision. Default is `4`.
* String assertions:
  * `assert.that(string).matches(regexOrString)` or `assert.isMatching(string, regexOrString)`
* Array inclusion:
  * `assert.that(collection).includes(object)`
  * `assert.that(collection).doesNotInclude(object)`
  * `assert.that(collection).includesExactly(...objects)`
* Emptiness
  * `assert.that(collection).isEmpty()` or `assert.isEmpty(collection)`
  * `assert.that(collection).isNotEmpty()` or `assert.isNotEmpty(collection)`
  * the collection under test can be an `Array`, a `String` or a `Set`

Please take a look at the `tests` folder, you'll find examples of each possible test you can write. Testy is self-tested.

### Running testy globally

If you don't have a NPM project you can install testy globally using `npm install -g testy` and then run `testy <files>` 

### Other features

* **Running code before every test**: just like many testing frameworks have, there is a way to execute some code before every test in a suite using the `before()` function. Example:

    ```javascript
    const { suite, test, before, assert } = require('@pmoo/testy');
    
    suite('using the before() helper', () => {
      let answer;
    
      before(() => {
        answer = 42;
      });
    
      test('checking the answer', () => {
        assert.that(answer).isEqualTo(42);
      });
    });
    ```
* **Running code after every test**: just like many testing frameworks have, there is a way to execute some code after (cleanp) every test in a suite using the `after()` function. Example:

    ```javascript
    const { suite, test, before, after, assert } = require('@pmoo/testy');
    
    suite('using the after() helper', () => {
      let answer;
    
      before(() => {
        answer = 42;
      });
    
      after(() => {
        answer = undefined;
      });
    });
    ```
* **Support for pending tests**: if a test has no body, it will be reported as `[WIP]` and it won't be considered a failure.
* **Fail-Fast mode**: if enabled, it stops execution in the first test that fails (or has an error). Remaining tests will be marked as skipped.
* **Run tests and suites in random order**: a good test suite does not depend on a particular order. Enabling this setting is a good way to ensure that.
* **Strict check for assertions**: if a test does not evaluate any assertion while it is executed, the result is considered an error. Basically, a test with no assertion is considered a "bad" test.
* **Explicitly failing or marking a test as pending**: there's a possibility of marking a test as failed or pending, for example:

    ```javascript
    const { suite, test, fail, pending } = require('@pmoo/testy');
    
    suite('marking tests as failed and pending', () => {
      test('marking as failed', () =>
        fail.with('should not be here'));
      
      test('marking as pending', () =>
        pending.dueTo('did not have time to finish'));
    });
    ```
    
    The output includes the messages provided:
    ```
    [FAIL] marking as failed
      => should not be here
    [WIP] marking as pending
      => did not have time to finish
    ```

## Why?

Why another testing tool? The main reason is that we want to keep simplicity, something it's hard to see in the main testing tools out there. 

* **Zero dependencies:** right now, this project does not depend on any npm package, making the tool easy to install, and fast: essential to have immediate feedback while doing TDD. This is also good for installing on places where the internet connection is not good and we don't want to download hundreds of libraries.
* **Understandable object-oriented code:** we want to use this tool for teaching, so eventually we'll look at the code during lessons, and students should be able to see what is going on, and even contributing at it, with no dark magic involved. Also, we try to follow good OO practices.
* **Unique set of features:** we are not following any specification nor trying to copy behavior from other approaches (like the "xUnit" or "xSpec" way).  

["Design Principles Behind Smalltalk"](https://www.cs.virginia.edu/~evans/cs655/readings/smalltalk.html) is a source of inspiration for this work. We try to follow the same principles here. 

## Contributing

Please take a look at the [Contributing section](CONTRIBUTING.md).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/JavierGelatti"><img src="https://avatars2.githubusercontent.com/u/993337?v=4" width="100px;" alt=""/><br /><sub><b>Facundo Javier Gelatti</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=JavierGelatti" title="Tests">⚠️</a> <a href="https://github.com/ngarbezza/testy/commits?author=JavierGelatti" title="Code">💻</a></td>
    <td align="center"><a href="https://codepen.io/TomerBenRachel/"><img src="https://avatars2.githubusercontent.com/u/23402988?v=4" width="100px;" alt=""/><br /><sub><b>Tomer Ben-Rachel</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=TomerPacific" title="Tests">⚠️</a> <a href="https://github.com/ngarbezza/testy/commits?author=TomerPacific" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/abraaoduarte"><img src="https://avatars2.githubusercontent.com/u/6676804?v=4" width="100px;" alt=""/><br /><sub><b>Abraão Duarte</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=abraaoduarte" title="Code">💻</a></td>
    <td align="center"><a href="http://adico.tech"><img src="https://avatars0.githubusercontent.com/u/5412270?v=4" width="100px;" alt=""/><br /><sub><b>adico</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=adico1" title="Code">💻</a> <a href="https://github.com/ngarbezza/testy/commits?author=adico1" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/ask-imran"><img src="https://avatars0.githubusercontent.com/u/20487103?v=4" width="100px;" alt=""/><br /><sub><b>Askar Imran</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=ask-imran" title="Code">💻</a> <a href="https://github.com/ngarbezza/testy/commits?author=ask-imran" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://www.nigelyong.com/"><img src="https://avatars2.githubusercontent.com/u/23243585?v=4" width="100px;" alt=""/><br /><sub><b>Nigel Yong</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=niyonx" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/chelsieng"><img src="https://avatars1.githubusercontent.com/u/60008262?v=4" width="100px;" alt=""/><br /><sub><b>Chelsie Ng</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=chelsieng" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
