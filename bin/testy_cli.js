#!/usr/bin/env node

'use strict';

const ScriptAction = require('../lib/script_action');

const params = process.argv.slice(2);
const requestedAction = ScriptAction.for(params);
requestedAction.execute(params);
