import { I18n } from '../i18n/i18n.js';
import { isString } from '../utils.js';
import { ConfigurationParsingError } from '../errors.js';

/**
 * I transform a list of console parameters into a valid configuration object.
 * I can also differentiate between path parameters and configuration parameters.
 */
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
      LanguageConfigurationParameterParser,
      DirectoryConfigurationParameterParser,
      InvalidConfigurationParameter,
    ].find(configurationParameterParser =>
      configurationParameterParser.canHandle(param),
    );
    return paramParser.handle(param);
  }

  static sanitizeParameters(params) {
    let sanitizedParams = params

    const languageParamIndex = params.findIndex(param => param === '-l' || param === '--language');
    if (languageParamIndex >= 0) {
      sanitizedParams = this.sanitizeLanguageParamOptions(sanitizedParams, languageParamIndex);
    }

    const directoryParamIndex = params.findIndex(param => param === '-d' || param === '--directory');
    if (directoryParamIndex >= 0) {
      sanitizedParams = this.sanitizeDirectoryParamOptions(sanitizedParams, directoryParamIndex);
    }

    return sanitizedParams;
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

  static sanitizeDirectoryParamOptions(params, directoryParamIndex) {
    const directoryOption = params[directoryParamIndex + 1]
    if(directoryOption === undefined) {
      throw new ConfigurationParsingError('Must send a route for --directory option')
    }
    const directoryConfig = [`-d ${directoryOption}`];
    this.removeParameterAtIndex(params, directoryParamIndex);
    return [...params, ...directoryConfig];
  }

  static validateConfigurationParams(paramsList) {
    paramsList.forEach((param, index) => {
      if (this.isLanguageParam(param)) {
        this.validateLanguageOption(paramsList, index);
      }

      const previousParam = paramsList[index - 1]
      const previousParamIsDirectoryFlag = previousParam === '-d' || previousParam === '--directory'

      if (!this.isRawConfigurationParam(param) && !previousParamIsDirectoryFlag) {
        throw new ConfigurationParsingError('Run configuration parameters should always be sent at the end of test paths routes');
      }
    });
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
    return this.#matchesStringParam(string, '-f', '--fail-fast');
  }

  static isRandomizeParam(string) {
    return this.#matchesStringParam(string, '-r', '--randomize');
  }

  static isLanguageParam(paramExpression) {
    const options = paramExpression.split(' ');
    return this.#matchesStringParam(options[0], '-l', '--language');
  };

  static isDirectoryParam(paramExpression) {
    const options = paramExpression.split(' ');
    return this.#matchesStringParam(options[0], '-d', '--directory');
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

class LanguageConfigurationParameterParser {

  static canHandle(consoleParam) {
    return ParametersParser.isLanguageParam(consoleParam);
  }

  static handle(consoleParam) {
    const options = consoleParam.split(' ');
    return { language: options[1] };
  }
}

class DirectoryConfigurationParameterParser {

  static canHandle(consoleParam) {
    return ParametersParser.isDirectoryParam(consoleParam);
  }

  static handle(consoleParam) {
    const options = consoleParam.split(' ');
    return { directory: options[1] };
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
