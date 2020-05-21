#!/usr/bin/env node

'use strict';

const ScriptAction = require('./script_action');

const params = process.argv.slice(2);
const requestedAction = ScriptAction.for(params);
requestedAction.execute(params);
