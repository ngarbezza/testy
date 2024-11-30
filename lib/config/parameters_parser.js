/**
 * I transform a list of parameters into a valid configuration object.
 */

export class ParametersParser {
  generateConfigurationFromParams(params) {
    let generatedParams = {};
    params.forEach(param => {
      const runParameter = this.generateRunParameter(param);
      generatedParams = { ...generatedParams, ...runParameter };
    });

    return generatedParams;
  }

  generateRunParameter(param) {
    if (param === '-f' || param === '--fail-fast') {
      return { failFast: true };
    }

    if (param === '-r' || param === '--randomize') {
      return { randomOrder: true };
    }
    if (this.isLanguageParam(param)) {
      const options = param.split(' ');
      return { language: options[1] };
    }
  }

  isLanguageParam(param) {
    const options = param.split(' ');
    return options[0] === '-l' || options[0] === '--language';
  }
}
