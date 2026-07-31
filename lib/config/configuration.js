import { fileURLToPath, URL } from 'node:url';
import { FailFast } from './fail_fast.js';
import { NodeFileSystem } from '../host/file_system.js';

const CONFIGURATION_FILE_NAME = '.testyrc.json';
const DEFAULT_CONFIGURATION_PATH = fileURLToPath(new URL('./default_configuration.json', import.meta.url));
const fileSystem = new NodeFileSystem();

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
    const defaultConfiguration = fileSystem.readJson(DEFAULT_CONFIGURATION_PATH);
    try {
      userConfiguration = fileSystem.readJson(fileSystem.resolvePathFor(CONFIGURATION_FILE_NAME));
      // eslint-disable-next-line no-unused-vars
    } catch (_error) {
      // returning an empty object as configuration is fine
    }

    return new this(userConfiguration, defaultConfiguration);
  }

  static withConfiguration(aConfiguration) {
    const defaultConfiguration = fileSystem.readJson(DEFAULT_CONFIGURATION_PATH);
    const userConfiguration = fileSystem.readJson(fileSystem.resolvePathFor(CONFIGURATION_FILE_NAME));
    return new this({ ...userConfiguration, ...aConfiguration }, defaultConfiguration);
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

  output() {
    return this.#configurationOptions.output;
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
