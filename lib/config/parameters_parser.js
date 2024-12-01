/**
 * I transform a list of console parameters into a valid configuration object.
 */

export class ParametersParser {
  static generateRunConfigurationFromParams(params) {
    let generatedParams = {};
    params.forEach(param => {
      const runParameter = this.#generateRunConfigurationParameter(param);
      generatedParams = { ...generatedParams, ...runParameter };
    });

    return generatedParams;
  }

  static #generateRunConfigurationParameter(param) {
    const paramParser = [FailFastConfigurationParameterParser, RandomizeConfigurationParameterParser, LanguageConfigurationParameterParser, InvalidConfigurationParameter].find(configurationParameterParser => configurationParameterParser.canHandle(param))
    return paramParser.handle(param)
  }
}

class FailFastConfigurationParameterParser {
  static canHandle(consoleParam) {
    return this.#isFailFastParam(consoleParam);
  }

  static handle(_consoleParam) {
    return { failFast: true };
  }

  static #isFailFastParam(param) {
    return param === '-f' || param === '--fail-fast'
  }
}

class RandomizeConfigurationParameterParser {
  static canHandle(consoleParam) {
    return this.#isRandomizeParam(consoleParam);
  }

  static handle(_consoleParam) {
    return { randomOrder: true}
  }

  static #isRandomizeParam(param) {
    return param === '-r' || param === '--randomize'
  }
}

class LanguageConfigurationParameterParser {
  static canHandle(consoleParam) {
    return this.#isLanguageParam(consoleParam);
  }

  static handle(consoleParam) {
    const options = consoleParam.split(' ');
    return { language: options[1] };
  }
  static #isLanguageParam(param) {
    const options = param.split(' ');
    return options[0] === '-l' || options[0] === '--language';
  }
}

class InvalidConfigurationParameter {
  static canHandle(_consoleParam) {
    return true
  }

  static handle(configurationParam) {
    throw Error(`Cannot parse invalid run configuration parameter ${configurationParam}. Please provide a valid configuration to run the tests.`)
  }
}