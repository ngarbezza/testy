'use strict';

import { FailFast } from './fail_fast.js';
import { resolvePathFor } from '../utils.js';

// Change to import assertions when reaching Node 18
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const CONFIGURATION_FILE_NAME = '.testyrc.json';

export class Configuration {
  // instance creation

  static current() {
    let userConfiguration;
    const defaultConfiguration = require('./default_configuration.json');
    try {
      userConfiguration = require(resolvePathFor(CONFIGURATION_FILE_NAME));
    } catch (error) {
      userConfiguration = {};
    }

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
    return new RegExp(this.filterRaw());
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

  timeoutMs() {
    return this._configurationOptions.timeoutMs;
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

  _initializeOptions() {
    this._configurationOptions = { ...this._defaultConfigurationOptions, ...this._userConfigurationOptions };
  }
}
