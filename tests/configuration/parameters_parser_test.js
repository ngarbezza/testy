import { assert, suite, test } from '../../lib/testy.js';
import { ParametersParser } from '../../lib/config/parameters_parser.js';
import { I18n } from '../../lib/i18n/i18n.js';
import { ConfigurationParsingError, InvalidConfigurationError } from '../../lib/errors.js';

suite('Parameters parser', () => {

  test('returns empty configuration if passing an empty params list', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams([]);
    assert.areEqual(configuration, {});
  });

  test('returns configuration with fail fast mode enabled if passing -f option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['-f']);
    assert.areEqual(configuration, { failFast: true });
  });

  test('returns configuration with fail fast mode enabled if passing --fail-fast option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['--fail-fast']);
    assert.areEqual(configuration, { failFast: true });
  });

  test('returns configuration with randomize mode enabled if passing -r option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['-r']);
    assert.areEqual(configuration, { randomOrder: true });
  });

  test('returns configuration with randomize enabled if passing --randomize', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['--randomize']);
    assert.areEqual(configuration, { randomOrder: true });
  });

  test('returns configuration with italian language enabled if passing \'-l it\' en option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['-l it']);
    assert.areEqual(configuration, { language: 'it' });
  });

  test('returns configuration with italian language enabled if passing \'-language it\' en option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['--language it']);
    assert.areEqual(configuration, { language: 'it' });
  });

  test('returns configuration with specific directory is passing --directory option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['--directory ./my_tests']);
    assert.areEqual(configuration, { directory: './my_tests' });
  });

  test('returns configuration with specific directory if passing -d option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['-d ./my_tests']);
    assert.areEqual(configuration, { directory: './my_tests' });
  });

  test('returns configuration with specific file extension if passing --extension option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['--extension .*_test.rb$']);
    assert.areEqual(configuration, { filter: '.*_test.rb$' });
  });

  test('returns configuration with specific file extension if passing --e option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['-e .*_test.rb$']);
    assert.areEqual(configuration, { filter: '.*_test.rb$' });
  });


  test('returns configuration with fail fast, randomize and english language enabled when mixing long and short commands no matter the order the params are sent', () => {
    const configuration1 = ParametersParser.generateRunConfigurationFromParams(['-f', '--randomize', '-l en']);
    const configuration2 = ParametersParser.generateRunConfigurationFromParams(['--fail-fast', '-l en', '-r']);
    const configuration3 = ParametersParser.generateRunConfigurationFromParams(['--language en', '-f', '-r']);
    const configuration4 = ParametersParser.generateRunConfigurationFromParams(['--directory ./a_directory', '-l it', '-r']);
    const configuration5 = ParametersParser.generateRunConfigurationFromParams(['--extension .*_test.rb$', '-l it', '-r']);

    assert.areEqual(configuration1, {
      failFast: true,
      randomOrder: true,
      language: 'en',
    });
    assert.areEqual(configuration2, {
      failFast: true,
      randomOrder: true,
      language: 'en',
    });
    assert.areEqual(configuration3, {
      failFast: true,
      randomOrder: true,
      language: 'en',
    });
    assert.areEqual(configuration4, {
      directory: './a_directory',
      randomOrder: true,
      language: 'it',
    });
    assert.areEqual(configuration5, {
      filter: '.*_test.rb$',
      randomOrder: true,
      language: 'it',
    });
  });

  test('throws an error when sending unknown params', () => {
    assert
      .that(() => ParametersParser.generateRunConfigurationFromParams(['fake param']))
      .raises(new ConfigurationParsingError(`Cannot parse invalid run configuration parameter ${'fake param'}.`));
  });

  test('splits between path params and configuration params', () => {
    const testPath1 = 'I am a test path';
    const testPath2 = 'I am another test path';

    const {
      pathsParams,
      configurationParams,
    } = ParametersParser.getPathsAndConfigurationParams([testPath1, testPath2, '-f', '-r']);
    assert.areEqual(pathsParams, [testPath1, testPath2]);
    assert.areEqual(configurationParams, ['-f', '-r']);
  });

  test('splits between path params and configuration params when path params are empty', () => {
    const {
      pathsParams,
      configurationParams,
    } = ParametersParser.getPathsAndConfigurationParams(['-f', '-r']);
    assert.areEqual(pathsParams, []);
    assert.areEqual(configurationParams, ['-f', '-r']);
  });

  test('splits between path params and configuration params when configuration params are empty', () => {
    const testPath1 = 'I am a test path';
    const testPath2 = 'I am another test path';

    const {
      pathsParams,
      configurationParams,
    } = ParametersParser.getPathsAndConfigurationParams([testPath1, testPath2]);
    assert.areEqual(pathsParams, [testPath1, testPath2]);
    assert.areEqual(configurationParams, []);
  });

  test('splits between path params and configuration params when both are empty', () => {
    const {
      pathsParams,
      configurationParams,
    } = ParametersParser.getPathsAndConfigurationParams([]);
    assert.areEqual(pathsParams, []);
    assert.areEqual(configurationParams, []);
  });

  test('throws an error when file path params are sent after configuration parameters', () => {
    const testPath1 = 'I am a test path';
    assert
      .that(() => ParametersParser.getPathsAndConfigurationParams(['-f', testPath1]))
      .raises(new ConfigurationParsingError('Run configuration parameters should always be sent at the end of test paths routes'));
  });

  test('returns sanitized params when passing a valid list of params', () => {
    const sanitizedParams = ParametersParser.sanitizeParameters(['-f', '-r']);
    assert.areEqual(sanitizedParams, ['-f', '-r']);
  });

  test('returns sanitized params when passing a valid list of params including language params', () => {
    const sanitizedParams = ParametersParser.sanitizeParameters(['-f', '-l', 'it', '-r']);
    assert.areEqual(sanitizedParams, ['-f', '-r', '-l it']);
  });

  test('returns sanitized params when passing a valid list of params including directory params', () => {
    const sanitizedParams = ParametersParser.sanitizeParameters(['-f', '-d', './a_directory', '-r']);
    assert.areEqual(sanitizedParams, ['-f', '-r', '-d ./a_directory']);
  });

  test('returns sanitized params when passing a valid list of params including extension params', () => {
    const sanitizedParams = ParametersParser.sanitizeParameters(['-f', '-d', './a_directory', '-r', '--extension', '.*_test.rb$']);
    assert.areEqual(sanitizedParams, ['-f', '-r', '-d ./a_directory', '-e .*_test.rb$']);
  });

  test('throws an error when sending invalid language option', () => {
    assert
      .that(() => ParametersParser.sanitizeParameters(['-l', 'fakeLanguage']))
      .raises(new InvalidConfigurationError(`Language '${'fakeLanguage'}' is not supported. Allowed values: ${I18n.supportedLanguages().join(', ')}`));
  });

  test('throws an error when language parameters do not have the proper order', () => {
    assert
      .that(() => ParametersParser.sanitizeParameters(['it', '-l']))
      .raises(new InvalidConfigurationError(`Language '${undefined}' is not supported. Allowed values: ${I18n.supportedLanguages().join(', ')}`));
  });

  test('throws an error when directory parameter does not have an argument', () => {
    assert
      .that(() => ParametersParser.sanitizeParameters(['-d']))
      .raises(new ConfigurationParsingError('Must send a route for -d option'));
  });

  test('throws an error when extension parameter does not have an argument', () => {
    assert
        .that(() => ParametersParser.sanitizeParameters(['-e']))
        .raises(new ConfigurationParsingError('Must send a route for -e option'));
  });

  test('validateConfigurationParams fails if a path param is sent', () => {
    const testPath1 = 'I am a test path';
    assert
      .that(() => ParametersParser.validateConfigurationParams(['-f', testPath1]))
      .raises(new ConfigurationParsingError('Run configuration parameters should always be sent at the end of test paths routes'));
  });

  test('validateConfigurationParams fails if language option is not valid', () => {
    assert
      .that(() => ParametersParser.validateConfigurationParams(['-l', 'de']))
      .raises(new InvalidConfigurationError(`Language 'de' is not supported. Allowed values: ${I18n.supportedLanguages().join(', ')}`));
  });

  test('validateConfigurationParams passes if language option is valid', () => {
    assert
      .that(() => ParametersParser.validateConfigurationParams(['-l', 'it']))
      .doesNotRaiseAnyErrors();
  });
});
