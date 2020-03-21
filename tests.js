'use strict';

const { Testy } = require('./testy');

Testy.configuredWith({
  // Relative or absolute path to all the test files. Default './tests'
  directory: './tests',
  // Regular expression to filter test files to run
  filter: /.*test.js$/,
  // 'en' is the default. For example, you can try 'es' to see output in Spanish
  language: 'en',
  // Stops at the first failed or errored test. false by default
  failFast: false,
  // Enforces randomness in the tests inside each suite. false by default
  randomOrder: true,
}).run();
