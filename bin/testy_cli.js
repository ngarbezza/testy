#!/usr/bin/env node

import process from 'node:process';
import console from 'node:console';

import { ScriptAction } from '../lib/script_action.js';

const params = process.argv.slice(2);

ScriptAction
  .for(params, process, console)
  .execute();
