import { assert, suite, test } from '../../lib/testy.js';
import { ParametersParser } from '../../lib/config/parameters_parser.js';
import { I18n } from '../../lib/i18n/i18n.js';
import {
  InvalidConfigurationParameterError,
  InvalidConfigurationParametersOrderError,
  UnsupportedLanguageError,
} from '../../lib/errors.js';

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

  test('returns configuration with fail fast, randomize and english language enabled when mixing long and short commands no matter the order the params are sent', () => {
    const configuration1 = ParametersParser.generateRunConfigurationFromParams(['-f', '--randomize', '-l en']);
    const configuration2 = ParametersParser.generateRunConfigurationFromParams(['--fail-fast', '-l en', '-r']);
    const configuration3 = ParametersParser.generateRunConfigurationFromParams(['--language en', '-f', '-r']);

    assert.areEqual(configuration1, { failFast: true, randomOrder: true, language: 'en' });
    assert.areEqual(configuration2, { failFast: true, randomOrder: true, language: 'en' });
    assert.areEqual(configuration3, { failFast: true, randomOrder: true, language: 'en' });
  });

  test('throws an error when sending unknown params', () => {
    assert
      .that(() => ParametersParser.generateRunConfigurationFromParams(['fake param']))
      .raises(new InvalidConfigurationParameterError(`Cannot parse invalid run configuration parameter ${'fake param'}.`));
  });

  test('splits between path params and configuration params', () => {
    const testPath1 = 'I am a test path';
    const testPath2 = 'I am another test path';

    const { pathsParams, configurationParams } = ParametersParser.getPathsAndConfigurationParams([testPath1, testPath2, '-f', '-r']);
    assert.areEqual(pathsParams, [testPath1, testPath2]);
    assert.areEqual(configurationParams, ['-f', '-r']);
  });

  test('splits between path params and configuration params when path params are empty', () => {
    const { pathsParams, configurationParams } = ParametersParser.getPathsAndConfigurationParams(['-f', '-r']);
    assert.areEqual(pathsParams, []);
    assert.areEqual(configurationParams, ['-f', '-r']);
  });

  test('splits between path params and configuration params when configuration params are empty', () => {
    const testPath1 = 'I am a test path';
    const testPath2 = 'I am another test path';

    const { pathsParams, configurationParams } = ParametersParser.getPathsAndConfigurationParams([testPath1, testPath2]);
    assert.areEqual(pathsParams, [testPath1, testPath2]);
    assert.areEqual(configurationParams, []);
  });

  test('splits between path params and configuration params when both are empty', () => {
    const { pathsParams, configurationParams } = ParametersParser.getPathsAndConfigurationParams([]);
    assert.areEqual(pathsParams, []);
    assert.areEqual(configurationParams, []);
  });

  test('throws an error when file path params are sent after configuration parameters', () => {
    const testPath1 = 'I am a test path';
    assert
      .that(() => ParametersParser.getPathsAndConfigurationParams(['-f', testPath1]))
      .raises(new InvalidConfigurationParametersOrderError('Run configuration parameters should always be sent at the end of test paths routes'));
  });

  test('returns sanitized params when passing a valid list of params', () => {
    const sanitizedParams = ParametersParser.sanitizeParameters(['-f', '-r']);
    assert.areEqual(sanitizedParams, ['-f', '-r']);
  });

  test('returns sanitized params when passing a valid list of params including language params', () => {
    const sanitizedParams = ParametersParser.sanitizeParameters(['-f', '-l', 'it', '-r']);
    assert.areEqual(sanitizedParams, ['-f', '-r', '-l it']);
  });

  test('throws an error when sending invalid language option', () => {
    assert
      .that(() => ParametersParser.sanitizeParameters(['-l', 'fakeLanguage']))
      .raises(new UnsupportedLanguageError(`Language '${'fakeLanguage'}' is not supported. Allowed values: ${I18n.supportedLanguages().join(', ')}`));
  });

  test('throws an error when language parameters do not have the proper order', () => {
    assert
      .that(() => ParametersParser.sanitizeParameters(['it', '-l']))
      .raises(new UnsupportedLanguageError(`Language '${undefined}' is not supported. Allowed values: ${I18n.supportedLanguages().join(', ')}`));
  });
});
