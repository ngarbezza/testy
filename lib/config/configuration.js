import { FailFast } from './fail_fast.js';
import { resolvePathFor } from '../utils.js';

// Change to import assertions when reaching Node 18
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const CONFIGURATION_FILE_NAME = '.testyrc.json';

/**
 * I load, parse and expose the user configuration parameters. I merge the user configurations with the tool defaults,
 * the users choices are prioritary.
 *
 * Please refer to `.testyrc.json` file in the root folder to see all the configuration options available.
 */
export class Configuration {
  #userConfigurationOptions;
  #defaultConfigurationOptions;
  #configurationOptions;

  // instance creation

  static current() {
    let userConfiguration = {};
    const defaultConfiguration = require('./default_configuration.json');
    try {
      userConfiguration = require(resolvePathFor(CONFIGURATION_FILE_NAME));
      // eslint-disable-next-line no-unused-vars
    } catch (_error) {
      // returning an empty object as configuration is fine
    }

    return new this(userConfiguration, defaultConfiguration);
  }

  static withConfiguration(aConfiguration) {
    const defaultConfiguration = require('./default_configuration.json');
    return new this(aConfiguration, defaultConfiguration);
  }
  constructor(userConfiguration, defaultConfiguration) {
    this.#userConfigurationOptions = userConfiguration;
    this.#defaultConfigurationOptions = defaultConfiguration;
    this.#initializeOptions();
  }

  // accessing configuration parameters

  directory() {
    return this.#configurationOptions.directory;
  }

  filter() {
    return new RegExp(this.filterRaw());
  }

  filterRaw() {
    return this.#configurationOptions.filter;
  }

  language() {
    return this.#configurationOptions.language;
  }

  failFastMode() {
    return new FailFast(this.#configurationOptions.failFast);
  }

  randomOrder() {
    return this.#configurationOptions.randomOrder;
  }

  timeoutMs() {
    return this.#configurationOptions.timeoutMs;
  }

  // initialization

  #initializeOptions() {
    this.#configurationOptions = { ...this.#defaultConfigurationOptions, ...this.#userConfigurationOptions };
  }
}
