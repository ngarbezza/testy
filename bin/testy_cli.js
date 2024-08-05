#!/usr/bin/env node

import process from 'node:process';
import { ScriptAction } from '../lib/script_action.js';

const params = process.argv.slice(2);
const requestedAction = ScriptAction.for(params);
requestedAction.execute(params).then(() => process.exit());
