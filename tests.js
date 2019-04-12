'use strict';

const { Testy } = require('./testy');

Testy.configuredWith({
  // Absolute path. Resolved by 'path' module
  directory: require('path').resolve('./tests'),
  // 'en' is the default. For example, you can try 'es' to see output in Spanish
  language: 'en',
  // Stops at the first failed or errored test. false by default
  failFast: false,
}).run();
