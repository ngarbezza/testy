/**
 * I transform a list of console parameters into a valid configuration object.
 * I can also differentiate between path parameters and configuration parameters.
 */
import { isFailFastParam, isLanguageParam, isRandomizeParam } from '../utils.js';

const LANGUAGE_OPTIONS = ['es', 'en', 'it'];
export class ParametersParser {

  static generateRunConfigurationFromParams(params) {
    const sanitizedParams = this.sanitizeParameters(params);
    return this.generateRunConfigurationFromSanitizedParams(sanitizedParams);
  }

  static generateRunConfigurationFromSanitizedParams(sanitizedParams) {
    let generatedParams = {};
    sanitizedParams.forEach(param => {
      const runParameter = this.#generateRunConfigurationParameter(param);
      generatedParams = { ...generatedParams, ...runParameter };
    });

    return generatedParams;
  }

  static #generateRunConfigurationParameter(param) {
    const paramParser = [FailFastConfigurationParameterParser, RandomizeConfigurationParameterParser, LanguageConfigurationParameterParser, InvalidConfigurationParameter].find(configurationParameterParser => configurationParameterParser.canHandle(param));
    return paramParser.handle(param);
  }

  static sanitizeParameters(params) {
    const languageParamIndex = params.findIndex(param => param === '-l' || param === '--language');
    if (languageParamIndex >= 0) {
      return this.#sanitizeLanguageParamOptions(params, languageParamIndex);
    }
    return params;
  }

  static #sanitizeLanguageParamOptions(params, languageParamIndex) {
    const languageOption = this.#validateLanguageOption(params, languageParamIndex);
    const languageConfig = [`-l ${languageOption}`];
    this.#removeLanguageParameters(params, languageParamIndex);
    return [...params, ...languageConfig];
  }

  static #validateLanguageOption(params, languageParamIndex) {
    const languageOption = params[languageParamIndex + 1];
    if (!LANGUAGE_OPTIONS.includes(languageOption)) {
      throw new Error('Invalid language option. Please choose an option between es for Spanish, en for English or it for Italian');
    }
    return languageOption;
  }

  static #removeLanguageParameters(params, languageParamIndex) {
    params.splice(languageParamIndex, 2);
  }

  static getPathsAndConfigurationParams(allParams) {
    const firstConfigParamIndex = allParams.findIndex(param => this.isConfigurationParam(param));
    if (firstConfigParamIndex >= 0) {
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
    return isFailFastParam(param) || isRandomizeParam(param) || isLanguageParam(param);
  }
}

class FailFastConfigurationParameterParser {

  static canHandle(consoleParam) {
    return isFailFastParam(consoleParam);
  }

  static handle(_consoleParam) {
    return { failFast: true };
  }
}

class RandomizeConfigurationParameterParser {

  static canHandle(consoleParam) {
    return isRandomizeParam(consoleParam);
  }

  static handle(_consoleParam) {
    return { randomOrder: true };
  }
}

class LanguageConfigurationParameterParser {

  static canHandle(consoleParam) {
    return isLanguageParam(consoleParam);
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
