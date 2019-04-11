'use strict';

const { Testy } = require('./testy');

Testy.configuredWith({
  directory: require('path').resolve('./tests'),
  language: 'en' // you can try 'es' to see spanish output
}).run();
