import process from 'node:process';
import console from 'node:console';

import { Testy } from './testy.js';
import { Configuration } from './config/configuration.js';
import { InvalidConfigurationError } from './errors.js';

// Change to import assertions when reaching Node 18
import { createRequire } from 'module';
import { ParametersParser } from './config/parameters_parser.js';
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
    console.log('   -h, --help        Displays this text');
    console.log('   -v, --version     Displays the current version');
    console.log('   -f, --fail-fast   Enables fail fast option for running tests');
    console.log('   -r, --randomize   Enables random order option for running tests');
    console.log('   -l, --language xx Sets a language for running tests. Available options are \'es\' for Spanish, \'en\' for English and \'it\' for Italian');
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
      const { pathsParams, configurationParams } = ParametersParser.getPathsAndConfigurationParams(params);
      const selectedConfiguration = ParametersParser.generateRunConfigurationFromParams(configurationParams);
      const testyInstance = Testy.configuredWith(Configuration.withConfiguration(selectedConfiguration));
      await testyInstance.run(pathsParams);
      this._exitSuccessfully();
    } catch (error) {
      if (error instanceof InvalidConfigurationError) {
        this._handleInvalidConfigurationError(error);
      } else {
        this._handleUnexpectedError(error);
      }
      this._exitWithFailure();
    }
  },

  // Private

  _handleInvalidConfigurationError(error) {
    console.log('Sorry, an error was found loading the configuration. Details below:');
    console.log(`=> ${error.reason()}`);
    console.log('Please correct the configuration parameter(s) and try again.');
  },

  _handleUnexpectedError(error) {
    const { bugs } = this._packageData();
    console.log('Sorry, an unexpected error happened while loading Testy, you did nothing wrong. Details below:');
    console.log(error.stack);
    console.log(`Please report this issue including the full error message and stacktrace at ${bugs.url}.`);
  },
};
