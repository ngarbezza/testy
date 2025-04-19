import process from 'node:process';
import console from 'node:console';

import { Testy } from './testy.js';
import { Configuration } from './config/configuration.js';
import {
  InvalidConfigurationError,
  InvalidConfigurationParameterError,
  InvalidConfigurationParametersOrderError,
  UnsupportedLanguageError,
} from './errors.js';

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
    console.log(`
Testy: ${description}

Usage: 

   testy [-h --help] [-v --version] ...test files or folders...

Options: 
   -h, --help        Displays this text
   -v, --version     Displays the current version
   -f, --fail-fast   Enables fail fast option for running tests
   -r, --randomize   Enables random order option for running tests
   -l, --language xx Sets a language for running tests. Available options are 'es' for Spanish, 'en' for English and 'it' for Italian
  `);
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
      this._handleExecutionError(error);
      this._exitWithFailure();
    }
  },

  // Private

  _isParsingParametersError(error) {
    return error instanceof InvalidConfigurationParameterError || error instanceof InvalidConfigurationParametersOrderError || error instanceof UnsupportedLanguageError;
  },

  _handleExecutionError(error) {
    if (error instanceof InvalidConfigurationError) {
      this._handleInvalidConfigurationError(error);
    }
    if (this._isParsingParametersError(error)) {
      this._handleParsingParametersError(error);
    } else {
      this._handleUnexpectedError(error);
    }
  },

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

  _handleParsingParametersError(error) {
    console.log('Sorry, an error happened while parsing configuration parameters:');
    console.log(`=> ${error.reason()}`);
    console.log('Please run -h or --help options to check available parameters');
  },
};
