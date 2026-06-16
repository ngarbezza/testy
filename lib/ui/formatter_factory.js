import { ConsoleFormatter } from './console_formatter.js';
import { TapFormatter } from './tap_formatter.js';
import { JsonFormatter } from './json_formatter.js';

/**
 * I build the right {@link Formatter} for a configured output format, defaulting to the
 * human-readable {@link ConsoleFormatter} when the format is unknown.
 */
export class FormatterFactory {
  static for(output, console, i18n) {
    const formatters = {
      console: ConsoleFormatter,
      tap: TapFormatter,
      json: JsonFormatter,
    };
    const FormatterClass = formatters[output] || ConsoleFormatter;
    return new FormatterClass(console, i18n);
  }
}
