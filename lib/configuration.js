'use strict';

const { resolvePathFor } = require('./utils');
const FailFast = require('./fail_fast');
const CONFIGURATION_FILE_NAME = '.testyrc.json';

class Configuration {
  
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
    this._userConfigurationOptions = userConfiguration;
    this._defaultConfigurationOptions = defaultConfiguration;
    this._initializeOptions();
  }
  
  // accessing configuration parameters
  
  directory() {
    return this._configurationOptions.directory;
  }
  
  filter() {
    return new RegExp(this._configurationOptions.filter);
  }

  filterRaw() {
    return this._configurationOptions.filter;
  }
  
  language() {
    return this._configurationOptions.language;
  }
  
  failFastMode() {
    return new FailFast(this._configurationOptions.failFast);
  }
  
  randomOrder() {
    return this._configurationOptions.randomOrder;
  }
  
  // configuring
  
  configureUI(ui) {
    ui.useLanguage(this.language());
  }
  
  configureTestRunner(testRunner) {
    testRunner.useLanguage(this.language());
    testRunner.setFailFastMode(this.failFastMode());
    testRunner.setTestRandomness(this.randomOrder());
  }
  
  // initialization
  
  _initializeOptions() {
    this._configurationOptions = { ...this._defaultConfigurationOptions, ...this._userConfigurationOptions };
  }
}

module.exports = Configuration;
