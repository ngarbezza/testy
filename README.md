# Testy
A very simple JS testing library, for educational purposes. Live at npm at @pmoo/testy.

## Installation

`npm install --save-dev @pmoo/testy`

## Usage

### Running a single file

```javascript
const { suite, tests, assertTrue } = require('@pmoo/testy');

suite('a boring test suite', () => {
  test('true is obviously true', () => assertTrue(true))
})
```

### Running tests from a folder

```javascript
const { runTesty } = require('@pmoo/testy');

runTesty({ directory: require('path').resolve('./tests') });
```

And it will run every file under the `tests` directory, and you can define suites in those files.

### Examples and available assertions

Please take a look at the `tests` folder, you'll find examples of each possible test you can write.

## Why?

Why another testing library? The main reason is that we want to keep simplicity, something it's hard to see in the main testing tools out there.

* **Less dependencies:** right now, we depend on just one npm package, making the library easy to install and avoiding conflict with other dependencies. This is also good for installing on places where the internet connection is not good and we don't want to download hundreds of libraries.
* **Understandable object-oriented code:** we want to use this tool for teaching, so eventually we'll look at the code during lessons, and students should be able to see what is going on, and even contributing at it, with no dark magic involved. Also, we try to follow good OO practices. 

## Contributing

Issues and Pull Requests are welcome. Please follow the issue templates that are already configured. Have in mind the "Why" section (simplicity, OO code with good practice). If you add a new feature, please add an example for it on the `tests` folder.
