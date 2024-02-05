#!/usr/bin/env node

'use strict';

import { ScriptAction } from '../lib/script_action.js';

const params = process.argv.slice(2);
const requestedAction = ScriptAction.for(params);
requestedAction.execute(params).then(r => process.exit());
