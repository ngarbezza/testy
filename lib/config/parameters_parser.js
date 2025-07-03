import { I18n } from '../i18n/i18n.js';
import { isString, isUndefined } from '../utils/index.js';
import { ConfigurationParsingError } from '../errors.js';

/**
 * I transform a list of console parameters into a valid configuration object.
 * I can also differentiate between path parameters and configuration parameters.
 */
const DIRECTORY_IDENTIFIERS = ['-d', '--directory'];
const LANGUAGE_IDENTIFIERS = ['-l', '--language'];
const EXTENSION_IDENTIFIERS = ['-e', '--extension'];
const FAIL_FAST_IDENTIFIERS = ['-f', '--fail-fast'];
const RANDOMIZE_IDENTIFIERS = ['-r', '--randomize'];

export class ParametersParser {

  static generateRunConfigurationFromParams(params) {
    const sanitizedParams = this.sanitizeParameters(params);
    return this.generateRunConfigurationFromSanitizedParams(sanitizedParams);
  }

  static generateRunConfigurationFromSanitizedParams(sanitizedParams) {
    let generatedParams = {};
    sanitizedParams.forEach(param => {
      const runParameter = this.generateRunConfigurationParameter(param);
      generatedParams = { ...generatedParams, ...runParameter };
    });

    return generatedParams;
  }

  static generateRunConfigurationParameter(param) {
    const paramParser = [
      FailFastConfigurationParameterParser,
      RandomizeConfigurationParameterParser,
      new ParameterWithArgumentParser(LANGUAGE_IDENTIFIERS, 'language'),
      new ParameterWithArgumentParser(DIRECTORY_IDENTIFIERS, 'directory'),
      new ParameterWithArgumentParser(EXTENSION_IDENTIFIERS, 'filter'),
      InvalidConfigurationParameter,
    ].find(configurationParameterParser =>
      configurationParameterParser.canHandle(param),
    );
    return paramParser.handle(param);
  }

  static sanitizeParameters(params) {
    let sanitizedParams = params;

    const languageParamIndex = params.findIndex(param => LANGUAGE_IDENTIFIERS.includes(param));
    if (languageParamIndex >= 0) {
      sanitizedParams = this.sanitizeLanguageParamOptions(sanitizedParams, languageParamIndex);
    }

    sanitizedParams = this.findIndexAndSanitize(sanitizedParams, DIRECTORY_IDENTIFIERS);
    sanitizedParams = this.findIndexAndSanitize(sanitizedParams, EXTENSION_IDENTIFIERS);

    return sanitizedParams;
  }

  static findIndexAndSanitize(params, paramNames) {
    const paramIndex = params.findIndex(param => paramNames.includes(param));
    if (paramIndex >= 0) {
      return this.sanitizeParamWithArgument(params, paramIndex, paramNames[0]);
    }
    return params;
  }

  static sanitizeLanguageParamOptions(params, languageParamIndex) {
    const languageOption = this.validateLanguageOption(params, languageParamIndex);
    const languageConfig = [`-l ${languageOption}`];
    this.removeParameterAtIndex(params, languageParamIndex);
    return [...params, ...languageConfig];
  }

  static validateLanguageOption(params, languageParamIndex) {
    const languageOption = params[languageParamIndex + 1];
    const supportedLanguages = I18n.supportedLanguages();
    if (!supportedLanguages.includes(languageOption)) {
      I18n.unsupportedLanguageException(languageOption, supportedLanguages);
    }
    return languageOption;
  }

  static removeParameterAtIndex(params, languageParamIndex) {
    params.splice(languageParamIndex, 2);
  }

  static sanitizeParamWithArgument(params, paramWithArgumentIndex, paramName) {
    const paramOption = params[paramWithArgumentIndex + 1];
    if (isUndefined(paramOption)) {
      throw new ConfigurationParsingError(`Must send a route for ${paramName} option`);
    }
    const paramConfig = [`${paramName} ${paramOption}`];
    this.removeParameterAtIndex(params, paramWithArgumentIndex);
    return [...params, ...paramConfig];
  }

  static validateConfigurationParams(paramsList) {
    paramsList.forEach((param, index) => {
      if (this.isParamWithArgument(param, LANGUAGE_IDENTIFIERS)) {
        this.validateLanguageOption(paramsList, index);
      }

      this.validateIsNotPathParam(param, paramsList, index);
    });
  }

  static validateIsNotPathParam(param, paramsList, paramIndex) {
    const previousParam = paramsList[paramIndex - 1];
    this.assertParamIsNotPathParam(param, previousParam);
  }

  static assertParamIsNotPathParam(param, previousParam) {
    const previousParamIsDirectoryOrExtensionFlag = ['-d', '--directory', '-e', '--extension'].includes(previousParam);

    if (!this.isRawConfigurationParam(param) && !previousParamIsDirectoryOrExtensionFlag) {
      throw new ConfigurationParsingError('Run configuration parameters should always be sent at the end of test paths routes');
    }
  }
  static getPathsAndConfigurationParams(allParams) {
    const firstConfigParamIndex = allParams.findIndex(param => this.isRawConfigurationParam(param));

    if (firstConfigParamIndex >= 0) {
      const paramsAfterFirstConfigurationParam = allParams.slice(firstConfigParamIndex);
      this.validateConfigurationParams(paramsAfterFirstConfigurationParam);

      return {
        pathsParams: allParams.slice(0, firstConfigParamIndex),
        configurationParams: allParams.slice(firstConfigParamIndex),
      };
    }

    return {
      pathsParams: allParams,
      configurationParams: [],
    };
  }

  static isRawConfigurationParam(param) {
    // pre sanitization
    const supportedLanguages = I18n.supportedLanguages();
    return supportedLanguages.includes(param) || param[0] === '-';
  }

  static isFailFastParam(string) {
    return this.#matchesStringParam(string, ...FAIL_FAST_IDENTIFIERS);
  }

  static isRandomizeParam(string) {
    return this.#matchesStringParam(string, ...RANDOMIZE_IDENTIFIERS);
  }

  static isParamWithArgument(paramExpression, expectedParams) {
    const options = paramExpression.split(' ');
    return this.#matchesStringParam(options[0], ...expectedParams);
  }

  static #matchesStringParam(param, ...strings) {
    return isString(param) && strings.includes(param);
  }
}

class FailFastConfigurationParameterParser {

  static canHandle(consoleParam) {
    return ParametersParser.isFailFastParam(consoleParam);
  }

  static handle(_consoleParam) {
    return { failFast: true };
  }
}

class RandomizeConfigurationParameterParser {

  static canHandle(consoleParam) {
    return ParametersParser.isRandomizeParam(consoleParam);
  }

  static handle(_consoleParam) {
    return { randomOrder: true };
  }
}

class ParameterWithArgumentParser {
  #paramIdentifiers;
  #propertyForConfiguration;

  constructor(paramIdentifiers, propertyForConfiguration) {
    this.#paramIdentifiers = paramIdentifiers;
    this.#propertyForConfiguration = propertyForConfiguration;
  }

  canHandle(consoleParam) {
    return ParametersParser.isParamWithArgument(consoleParam, this.#paramIdentifiers);
  }

  handle(consoleParam) {
    const options = consoleParam.split(' ');
    return { [this.#propertyForConfiguration]: options[1] };
  }
}

class InvalidConfigurationParameter {
  static canHandle(_consoleParam) {
    return true;
  }

  static handle(configurationParam) {
    throw new ConfigurationParsingError(`Cannot parse invalid run configuration parameter ${configurationParam}.`);
  }
}
