import { assert, suite, test } from '../../lib/testy.js';
import { ParametersParser } from '../../lib/config/parameters_parser.js';

suite('Parameters parser', () => {

  test('returns empty configuration if passing an empty params list', () => {
    const parametersParser = new ParametersParser();
    const configuration = parametersParser.generateConfigurationFromParams([]);
    assert.areEqual(configuration, {});
  });

  test('returns configuration with fail fast mode enabled if passing -f option', () => {
    const parametersParser = new ParametersParser();
    const configuration = parametersParser.generateConfigurationFromParams(['-f']);
    assert.areEqual(configuration, { failFast: true });
  });

  test('returns configuration with fail fast mode enabled if passing --fail-fast option', () => {
    const parametersParser = new ParametersParser();
    const configuration = parametersParser.generateConfigurationFromParams(['--fail-fast']);
    assert.areEqual(configuration, { failFast: true });
  });

  test('returns configuration with randomize mode enabled if passing -r option', () => {
    const parametersParser = new ParametersParser();
    const configuration = parametersParser.generateConfigurationFromParams(['-r']);
    assert.areEqual(configuration, { randomOrder: true });
  });

  test('returns configuration with randomize enabled if passing --randomize', () => {
    const parametersParser = new ParametersParser();
    const configuration = parametersParser.generateConfigurationFromParams(['--randomize']);
    assert.areEqual(configuration, { randomOrder: true });
  });

  test('returns configuration with english language enabled if passing \'-l en\' en option', () => {
    const parametersParser = new ParametersParser();
    const configuration = parametersParser.generateConfigurationFromParams(['-l en']);
    assert.areEqual(configuration, { language: 'en' });
  });

  test('returns configuration with english language enabled if passing \'-language en\' en option', () => {
    const parametersParser = new ParametersParser();
    const configuration = parametersParser.generateConfigurationFromParams(['--language en']);
    assert.areEqual(configuration, { language: 'en' });
  });

  test('returns configuration with spanish language enabled if passing \'-l es\' en option', () => {
    const parametersParser = new ParametersParser();
    const configuration = parametersParser.generateConfigurationFromParams(['-l es']);
    assert.areEqual(configuration, { language: 'es' });
  });

  test('returns configuration with english language enabled if passing \'-language es\' en option', () => {
    const parametersParser = new ParametersParser();
    const configuration = parametersParser.generateConfigurationFromParams(['--language es']);
    assert.areEqual(configuration, { language: 'es' });
  });

  test('returns configuration with italian language enabled if passing \'-l it\' en option', () => {
    const parametersParser = new ParametersParser();
    const configuration = parametersParser.generateConfigurationFromParams(['-l it']);
    assert.areEqual(configuration, { language: 'it' });
  });

  test('returns configuration with italian language enabled if passing \'-language it\' en option', () => {
    const parametersParser = new ParametersParser();
    const configuration = parametersParser.generateConfigurationFromParams(['--language it']);
    assert.areEqual(configuration, { language: 'it' });
  });

  test('returns configuration with fail fast and randomize modes enabled no matter the order the params are sent', () => {
    const parametersParser = new ParametersParser();
    const configuration1 = parametersParser.generateConfigurationFromParams(['-f', '-r']);
    const configuration2 = parametersParser.generateConfigurationFromParams(['-r', '-f']);

    assert.areEqual(configuration1, { failFast: true, randomOrder: true });
    assert.areEqual(configuration2, { failFast: true, randomOrder: true });
  });

  test('returns configuration with fail fast, randomize and english language enabled no matter the order the params are sent', () => {
    const parametersParser = new ParametersParser();
    const configuration1 = parametersParser.generateConfigurationFromParams(['-f', '-r', '-l en']);
    const configuration2 = parametersParser.generateConfigurationFromParams(['-f', '-l en', '-r']);
    const configuration3 = parametersParser.generateConfigurationFromParams(['-l en', '-f', '-r']);

    assert.areEqual(configuration1, { failFast: true, randomOrder: true, language: 'en' });
    assert.areEqual(configuration2, { failFast: true, randomOrder: true, language: 'en' });
    assert.areEqual(configuration3, { failFast: true, randomOrder: true, language: 'en' });
  });

    test('returns configuration with fail fast, randomize and english language enabled when using long commands versions no matter the order the params are sent', () => {
        const parametersParser = new ParametersParser();
        const configuration1 = parametersParser.generateConfigurationFromParams(['--fail-fast', '--randomize', '--language en']);
        const configuration2 = parametersParser.generateConfigurationFromParams(['--fail-fast', '--language en', '--randomize']);
        const configuration3 = parametersParser.generateConfigurationFromParams(['--language en', '--fail-fast', '--randomize']);

        assert.areEqual(configuration1, { failFast: true, randomOrder: true, language: 'en' });
        assert.areEqual(configuration2, { failFast: true, randomOrder: true, language: 'en' });
        assert.areEqual(configuration3, { failFast: true, randomOrder: true, language: 'en' });
    });

    test('returns configuration with fail fast, randomize and english language enabled when mixing long and short commands no matter the order the params are sent', () => {
        const parametersParser = new ParametersParser();
        const configuration1 = parametersParser.generateConfigurationFromParams(['-f', '--randomize', '-l en']);
        const configuration2 = parametersParser.generateConfigurationFromParams(['--fail-fast', '-l en', '-r']);
        const configuration3 = parametersParser.generateConfigurationFromParams(['--language en', '-f', '-r']);

        assert.areEqual(configuration1, { failFast: true, randomOrder: true, language: 'en' });
        assert.areEqual(configuration2, { failFast: true, randomOrder: true, language: 'en' });
        assert.areEqual(configuration3, { failFast: true, randomOrder: true, language: 'en' });
    });
});
