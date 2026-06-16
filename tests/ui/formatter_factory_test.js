import { assert, suite, test } from '../../lib/testy.js';
import { FormatterFactory } from '../../lib/ui/formatter_factory.js';
import { ConsoleFormatter } from '../../lib/ui/console_formatter.js';
import { TapFormatter } from '../../lib/ui/tap_formatter.js';
import { JsonFormatter } from '../../lib/ui/json_formatter.js';
import { I18n } from '../../lib/i18n/i18n.js';
import { FakeConsole } from './fake_console.js';

suite('formatter factory', () => {
  const build = output => FormatterFactory.for(output, new FakeConsole(), I18n.default());

  test('builds a ConsoleFormatter for "console"', () => {
    assert.that(build('console') instanceof ConsoleFormatter).isTrue();
  });

  test('builds a TapFormatter for "tap"', () => {
    assert.that(build('tap') instanceof TapFormatter).isTrue();
  });

  test('builds a JsonFormatter for "json"', () => {
    assert.that(build('json') instanceof JsonFormatter).isTrue();
  });

  test('falls back to ConsoleFormatter for an unknown output', () => {
    assert.that(build('nonsense') instanceof ConsoleFormatter).isTrue();
  });
});
