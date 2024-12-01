import { assert, suite, test } from '../../lib/testy.js';
import { ParametersParser } from '../../lib/config/parameters_parser.js';

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

  test('returns configuration with english language enabled if passing \'-l en\' en option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['-l en']);
    assert.areEqual(configuration, { language: 'en' });
  });

  test('returns configuration with english language enabled if passing \'-language en\' en option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['--language en']);
    assert.areEqual(configuration, { language: 'en' });
  });

  test('returns configuration with spanish language enabled if passing \'-l es\' en option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['-l es']);
    assert.areEqual(configuration, { language: 'es' });
  });

  test('returns configuration with english language enabled if passing \'-language es\' en option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['--language es']);
    assert.areEqual(configuration, { language: 'es' });
  });

  test('returns configuration with italian language enabled if passing \'-l it\' en option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['-l it']);
    assert.areEqual(configuration, { language: 'it' });
  });

  test('returns configuration with italian language enabled if passing \'-language it\' en option', () => {
    const configuration = ParametersParser.generateRunConfigurationFromParams(['--language it']);
    assert.areEqual(configuration, { language: 'it' });
  });

  test('returns configuration with fail fast and randomize modes enabled no matter the order the params are sent', () => {
    const configuration1 = ParametersParser.generateRunConfigurationFromParams(['-f', '-r']);
    const configuration2 = ParametersParser.generateRunConfigurationFromParams(['-r', '-f']);

    assert.areEqual(configuration1, { failFast: true, randomOrder: true });
    assert.areEqual(configuration2, { failFast: true, randomOrder: true });
  });

  test('returns configuration with fail fast, randomize and english language enabled no matter the order the params are sent', () => {
    const configuration1 = ParametersParser.generateRunConfigurationFromParams(['-f', '-r', '-l en']);
    const configuration2 = ParametersParser.generateRunConfigurationFromParams(['-f', '-l en', '-r']);
    const configuration3 = ParametersParser.generateRunConfigurationFromParams(['-l en', '-f', '-r']);

    assert.areEqual(configuration1, { failFast: true, randomOrder: true, language: 'en' });
    assert.areEqual(configuration2, { failFast: true, randomOrder: true, language: 'en' });
    assert.areEqual(configuration3, { failFast: true, randomOrder: true, language: 'en' });
  });

    test('returns configuration with fail fast, randomize and english language enabled when using long commands versions no matter the order the params are sent', () => {
        const configuration1 = ParametersParser.generateRunConfigurationFromParams(['--fail-fast', '--randomize', '--language en']);
        const configuration2 = ParametersParser.generateRunConfigurationFromParams(['--fail-fast', '--language en', '--randomize']);
        const configuration3 = ParametersParser.generateRunConfigurationFromParams(['--language en', '--fail-fast', '--randomize']);

        assert.areEqual(configuration1, { failFast: true, randomOrder: true, language: 'en' });
        assert.areEqual(configuration2, { failFast: true, randomOrder: true, language: 'en' });
        assert.areEqual(configuration3, { failFast: true, randomOrder: true, language: 'en' });
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
          .raises(new Error(`Cannot parse invalid run configuration parameter ${`fake param`}. Please provide a valid configuration to run the tests.`));
    })
});
