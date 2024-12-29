/**
 * I transform a list of console parameters into a valid configuration object.
 * I can also differentiate between path parameters and configuration parameters.
 */
import { I18n } from '../i18n/i18n.js';
import { isString } from '../utils.js';

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
    const paramParser = [FailFastConfigurationParameterParser, RandomizeConfigurationParameterParser, LanguageConfigurationParameterParser, InvalidConfigurationParameter].find(configurationParameterParser => configurationParameterParser.canHandle(param));
    return paramParser.handle(param);
  }

  static sanitizeParameters(params) {
    const languageParamIndex = params.findIndex(param => param === '-l' || param === '--language');
    if (languageParamIndex >= 0) {
      return this.sanitizeLanguageParamOptions(params, languageParamIndex);
    }
    return params;
  }

  static sanitizeLanguageParamOptions(params, languageParamIndex) {
    const languageOption = this.validateLanguageOption(params, languageParamIndex);
    const languageConfig = [`-l ${languageOption}`];
    this.removeLanguageParameters(params, languageParamIndex);
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

  static removeLanguageParameters(params, languageParamIndex) {
    params.splice(languageParamIndex, 2);
  }

  static getPathsAndConfigurationParams(allParams) {
    const firstConfigParamIndex = allParams.findIndex(param => this.isConfigurationParam(param));

    if (firstConfigParamIndex >= 0) {
      const paramsAfterFirstConfigurationParam = allParams.slice(firstConfigParamIndex);
      const thereIsPathParamAfterConfigParams = paramsAfterFirstConfigurationParam.some(param => !this.isConfigurationParam(param));
      if (thereIsPathParamAfterConfigParams) {
        throw new Error('Run configuration parameters should always be sent at the end of test paths routes');
      }
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

  static isConfigurationParam(param) {
    return this.isFailFastParam(param) || this.isRandomizeParam(param) || this.isLanguageParam(param);
  }

  static isFailFastParam(string) {
    return isString(string) && (string === '-f' || string === '--fail-fast');
  }

  static isRandomizeParam(string) {
    return isString(string) && (string === '-r' || string === '--randomize');
  }

  static isLanguageParam(param) {
    const options = param.split(' ');
    return isString(options[0]) && (options[0] === '-l' || options[0] === '--language');
  };
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

class LanguageConfigurationParameterParser {

  static canHandle(consoleParam) {
    return ParametersParser.isLanguageParam(consoleParam);
  }

  static handle(consoleParam) {

    const options = consoleParam.split(' ');
    return { language: options[1] };
  }
}

class InvalidConfigurationParameter {
  static canHandle(_consoleParam) {
    return true;
  }

  static handle(configurationParam) {
    throw new Error(`Cannot parse invalid run configuration parameter ${configurationParam}. Please run --help option to check available options.`);
  }
}