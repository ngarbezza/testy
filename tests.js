'use strict';

const { runTesty } = require('./testy');

runTesty({
  directory: require('path').resolve('./tests'),
  language: 'en' // you can try 'es' to see spanish output
});
