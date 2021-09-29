'use strict';

const { resolvePathFor } = require('./utils');
const FailFast = require('./fail_fast');
const CONFIGURATION_FILE_NAME = '.testyrc.json';

class Configuration {
  
  #userConfigurationOptions;
  #defaultConfigurationOptions;
  #configurationOptions;
  // instance creation
  
  static current() {
    let userConfiguration;
    try {
      userConfiguration = require(resolvePathFor(CONFIGURATION_FILE_NAME));
    } catch (error) {
      userConfiguration = {};
    }
    const defaultConfiguration = require('./default_configuration');
    return new this(userConfiguration, defaultConfiguration);
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
  
  // configuring
  
  configureUI(ui) {
    ui.useLanguage(this.language());
  }
  
  configureTestRunner(testRunner) {
    testRunner.setFailFastMode(this.failFastMode());
    testRunner.setTestRandomness(this.randomOrder());
  }
  
  // initialization
  
  #initializeOptions() {
    this.#configurationOptions = { ...this.#defaultConfigurationOptions, ...this.#userConfigurationOptions };
  }
}

module.exports = Configuration;
