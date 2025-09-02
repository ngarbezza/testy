import { Testy } from './testy.js';
import { Configuration } from './config/configuration.js';
import { ConfigurationParsingError, InvalidConfigurationError } from './errors.js';
import { ParametersParser } from './config/parameters_parser.js';

// Change to import assertions when reaching Node 22
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageData = require('../package.json');

export class ScriptAction {
  #process;
  #console;

  constructor(process, console) {
    this.#process = process;
    this.#console = console;
  }

  static availableActions() {
    return [ShowVersion, ShowHelp, RunTests];
  }

  static for(params, process, console) {
    return this.availableActions()
      .find(action => action.appliesTo(params))
      .handle(params, process, console);
  }

  static firstParamMatches(params, ...expressions) {
    return expressions.includes(params.at(0));
  }

  _process() {
    return this.#process;
  }

  _console() {
    return this.#console;
  }

  _exitSuccessfully() {
    this._process().exit(0);
  }

  _exitWithFailure() {
    this._process().exit(1);
  }
}

class ShowVersion extends ScriptAction {
  static appliesTo(params) {
    return this.firstParamMatches(params, '-v', '--version');
  }

  static handle(_params, process, console) {
    return new this(process, console);
  }

  async execute() {
    const {
      version,
      description,
      homepage,
    } = packageData;
    this._console().log(`Testy version: ${version}\n${description}\n${homepage}`);
    this._exitSuccessfully();
  }
}

class ShowHelp extends ScriptAction {

  static handle(_params, process, console) {
    return new this(process, console);
  }

  static appliesTo(params) {
    return this.firstParamMatches(params, '-h', '--help');
  }

  async execute() {
    const { description } = packageData;
    this._console().log(`
Testy: ${description}

Usage: 

   testy [-h --help] [-v --version] ...test files or folders...

Options: 
   -h, --help              Displays this text
   -v, --version           Displays the current version
   -f, --fail-fast         Enables fail fast option for running tests
   -r, --randomize         Enables random order option for running tests
   -l, --language xx       Sets a language for running tests. Available options are 'es' for Spanish, 'en' for English, 'it' for Italian and 'pt' for Portuguese
   -d, --directory route   Sets the parent directory for running tests. If explicit test routes are provided, this last ones will be prioritized over the set directory.
   -e, --extension filter  Sets the filter extension for running tests. Only tests with names matching this suffix will be executed.
  `);
    this._exitSuccessfully();
  }
}

class RunTests extends ScriptAction {
  #params;

  static appliesTo(_params) {
    // we want to run tests by default
    return true;
  }

  static handle(params, process, console) {
    return new this(params, process, console);
  }

  constructor(params, process, console) {
    super(process, console);
    this.#params = params;
  }

  async execute() {
    try {
      const {
        pathsParams,
        configurationParams,
      } = ParametersParser.getPathsAndConfigurationParams(this._params());
      const selectedConfiguration = ParametersParser.generateRunConfigurationFromParams(configurationParams);
      const testyInstance = Testy.configuredWith(Configuration.withConfiguration(selectedConfiguration));
      await testyInstance.run(pathsParams);
      this._exitSuccessfully();
    } catch (error) {
      this.#handle(error);
      this._exitWithFailure();
    }
  }

  // Private

  _params() {
    return this.#params;
  }

  #handle(error) {
    if (error instanceof InvalidConfigurationError) {
      this.#handleInvalidConfigurationError(error);
    } else if (error instanceof ConfigurationParsingError) {
      this.#handleParsingParametersError(error);
    } else {
      this.#handleUnexpectedError(error);
    }
  }

  #handleInvalidConfigurationError(error) {
    this._console().log('Sorry, an error was found loading the configuration. Details below:');
    this._console().log(`=> ${error.reason()}`);
    this._console().log('Please correct the configuration parameter(s) and try again.');
  }

  #handleUnexpectedError(error) {
    const { bugs } = packageData;
    this._console().log('Sorry, an unexpected error happened while loading Testy, you did nothing wrong. Details below:');
    this._console().log(error.stack);
    this._console().log(`Please report this issue including the full error message and stacktrace at ${bugs.url}.`);
  }

  #handleParsingParametersError(error) {
    this._console().log('Sorry, an error happened while parsing configuration parameters:');
    this._console().log(`=> ${error.reason()}`);
    this._console().log('Please run -h or --help options to check available parameters');
  }
}
