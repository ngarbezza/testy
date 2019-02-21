'use strict';

const { runTesty } = require('./testy');

runTesty({ directory: require('path').resolve('./tests') });
