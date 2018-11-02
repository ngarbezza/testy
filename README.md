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

And it will run every file under the `test` directory, and you can define suites in those files.

