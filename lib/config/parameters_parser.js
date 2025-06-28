import { I18n } from '../i18n/i18n.js';
import { isString, isUndefined } from '../utils.js';
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
      FileExtensionConfigurationParameterParser,
      InvalidConfigurationParameter,
    ].find(configurationParameterParser =>
      configurationParameterParser.canHandle(param),
    );
    return paramParser.handle(param);
  }

  static sanitizeParameters(params) {
    let sanitizedParams = params;

    const languageParamIndex = params.findIndex(param => param === '-l' || param === '--language');
    if (languageParamIndex >= 0) {
      sanitizedParams = this.sanitizeLanguageParamOptions(sanitizedParams, languageParamIndex);
    }

    const directoryParamIndex = params.findIndex(param => param === '-d' || param === '--directory');
    if (directoryParamIndex >= 0) {
      sanitizedParams = this.sanitizeParamWithArgument(sanitizedParams, directoryParamIndex, '-d')
    }

    const fileExtensionParamIndex = params.findIndex(param => param === '-e' || param === '--extension');
    if (fileExtensionParamIndex >= 0) {
      sanitizedParams = this.sanitizeParamWithArgument(sanitizedParams, fileExtensionParamIndex, '-e')
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
      if (this.isParamWithArgument(param, ['-l', '--language'])) {
        this.validateLanguageOption(paramsList, index);
      }

      const previousParam = paramsList[index - 1];
      const previousParamIsDirectoryFlag = previousParam === '-d' || previousParam === '--directory';
      const previousParamIsFileExtensionFlag = previousParam === '-e' || previousParam === '--extension';

      if (!this.isRawConfigurationParam(param) && !previousParamIsDirectoryFlag && !previousParamIsFileExtensionFlag) {
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

class LanguageConfigurationParameterParser {

  static canHandle(consoleParam) {
    return ParametersParser.isParamWithArgument(consoleParam, ['-l', '--language']);
  }

  static handle(consoleParam) {
    const options = consoleParam.split(' ');
    return { language: options[1] };
  }
}

class DirectoryConfigurationParameterParser {

  static canHandle(consoleParam) {
    return ParametersParser.isParamWithArgument(consoleParam, ['-d', '--directory']);
  }

  static handle(consoleParam) {
    const options = consoleParam.split(' ');
    return { directory: options[1] };
  }
}

class FileExtensionConfigurationParameterParser {

  static canHandle(consoleParam) {
    return ParametersParser.isParamWithArgument(consoleParam, ['-e', '--extension']);
  }

  static handle(consoleParam) {
    const options = consoleParam.split(' ');
    return { filter: options[1] };
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
