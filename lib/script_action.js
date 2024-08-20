import process from 'node:process';
import console from 'node:console';

import { Testy } from './testy.js';
import { Configuration } from './config/configuration.js';

// Change to import assertions when reaching Node 18
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const ScriptAction = {
  availableActions() {
    return [ ShowVersion, ShowHelp, RunTests ];
  },

  for(params) {
    return this.availableActions().find(action => action.appliesTo(params));
  },

  firstParamMatches(params, ...expressions) {
    return expressions.includes(params.at(0));
  },

  _packageData() {
    return require('../package.json');
  },

  _exitSuccessfully() {
    process.exit(0);
  },

  _exitWithFailure() {
    process.exit(1);
  },
};

const ShowVersion = {
  __proto__: ScriptAction,

  appliesTo(params) {
    return this.firstParamMatches(params, '-v', '--version');
  },

  async execute(_params) {
    const { version, description, homepage } = this._packageData();
    console.log(`Testy version: ${version}\n${description}\n${homepage}`);
    this._exitSuccessfully();
  },
};

const ShowHelp = {
  __proto__: ScriptAction,

  appliesTo(params) {
    return this.firstParamMatches(params, '-h', '--help');
  },

  async execute(_params) {
    const { description } = this._packageData();
    console.log(`Testy: ${description}\n`);
    console.log('Usage: \n');
    console.log('   testy [-h --help] [-v --version] ...test files or folders...\n');
    console.log('Options: \n');
    console.log('   -h, --help      Displays this text');
    console.log('   -v, --version   Displays the current version');
    this._exitSuccessfully();
  },
};

const RunTests = {
  __proto__: ScriptAction,

  appliesTo(_params) {
    // we want to run tests by default
    return true;
  },

  async execute(params) {
    try {
      const testyInstance = Testy.configuredWith(Configuration.current());
      await testyInstance.run(params);
      this._exitSuccessfully();
    } catch (error) {
      const { bugs } = this._packageData();
      console.log('Sorry, an unexpected error happened while loading Testy, you did nothing wrong. Details below:');
      console.log(error.stack);
      console.log(`Please report this issue including the full error message and stacktrace at ${bugs.url}.`);
      this._exitWithFailure();
    }
  },
};
