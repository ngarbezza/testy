#!/usr/bin/env node

'use strict';

const { Testy } = require('../testy');
const Configuration = require('./configuration');

const testyInstance = Testy.configuredWith(Configuration.current());
testyInstance.run();
