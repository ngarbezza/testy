# Diseño: salida LLM-friendly (TAP + JSON) — issue #380

> Fecha: 2026-06-06. Estado: **diseño aprobado**, pendiente plan de implementación.
> Contexto: primer quick win del roadmap de AI (ver [`doc/ai-ideas.md`](../ai-ideas.md)).
> Driver dominante: **simplicidad como costo** — habilitar consumo agéntico de la salida con
> pocos tokens, e insumo para el futuro benchmark de costo (Testy vs Jest/Vitest).

## Objetivo

Ofrecer formatos de salida pensados para que un agente (LLM) consuma los resultados con pocos
tokens y sin instrucciones extra para parsear, **sin romper el ADN de Testy** (zero-dependency,
OOP legible, salida humana actual intacta como default).

Se implementan **dos** formatos:
- **TAP** (Test Anything Protocol): streaming, una línea por test, mínimo en tokens, conocido
  nativamente por los LLMs.
- **JSON**: un objeto estructurado completo al final de la corrida.

El contraste "mínimo-streaming vs estructurado-completo" alimenta directamente el benchmark de
costo posterior.

## Decisiones tomadas

- **Formatos:** TAP + JSON (ambos).
- **Nombre de la opción:** key `output` en `.testyrc.json` y flag CLI `-o` / `--output`
  (corto consistente con `-l`, `-d`, `-e`). Valores: `console | tap | json`. Default: `console`.
- **Idioma de los mensajes de fallo:** idioma configurado (reusa el i18n existente vía
  `expressedIn(i18n)`). Los **estados/keys** van neutros (no traducidos).

## Arquitectura

Hoy `lib/ui/console_ui.js` (`ConsoleUI`) tiene un único `Formatter` concreto
(`lib/ui/formatter.js`) que escribe texto con colores ANSI a `console`, y recibe los eventos vía
callbacks de runner/suite/test.

Propuesta — **familia de `Formatter` polimórfica**:

- **Clase base `Formatter`**: define el protocolo (todos los `display*` + lifecycle:
  `startTimer`, `endTimer`, `displayInitialInformation`, `displaySuiteStart/End`,
  `displayRunnerEnd`, `displayError`, etc.). Los métodos decorativos tienen implementación
  no-op por defecto.
- Concretas:
  - **`ConsoleFormatter`**: el código actual, sin cambios de comportamiento (renombre desde
    el `Formatter` actual).
  - **`TapFormatter`**: emite TAP; por-test emite líneas; en `displayRunnerEnd` emite el plan/
    resumen como comentarios.
  - **`JsonFormatter`**: acumula resultados por-test; en `displayRunnerEnd` emite un único
    objeto JSON.
- **`ConsoleUI`** elige cuál instanciar mediante un pequeño factory según `configuration.output()`.

Los formatters de máquina **no emiten** colores ANSI, separadores, banners ni `console.time`
(que imprime texto humano): solo overridean lo que tiene sentido.

Valor extra: queda como ejemplo de polimorfismo legible, alineado con el propósito educativo.

## Contratos de salida

### TAP (streaming, una línea por test)

```
TAP version 13
1..3
ok 1 - 42 is 42, not surprising
not ok 2 - sum works
  ---
  message: Expected 5 to be equal to 4
  at: tests/example_test.js:12
  severity: failure
  ---
ok 3 - a skipped one # SKIP
# tests 3
# pass 1
# fail 1
# skip 1
# time 12ms
```

- `pending` → directiva `# TODO`.
- `error` vs `failure`: se distingue en `severity:` del bloque YAML (TAP de por sí no los separa).

### JSON (un objeto al final, keys idioma-neutro)

```json
{
  "tool": "@pmoo/testy",
  "version": "8.0.0",
  "summary": { "total": 3, "passed": 1, "failed": 1, "errored": 0, "pending": 0, "skipped": 1, "durationMs": 12 },
  "suites": [
    { "name": "a boring test suite", "file": "tests/example_test.js",
      "tests": [
        { "name": "42 is 42, not surprising", "status": "passed" },
        { "name": "sum works", "status": "failed", "failure": { "message": "Expected 5 to be equal to 4", "location": "tests/example_test.js:12" } },
        { "name": "a skipped one", "status": "skipped" }
      ] }
  ]
}
```

- `status`: `passed | failed | errored | pending | skipped` (estable, no traducido).
- `failure.message`: resuelto en el idioma configurado.

## Activación (config + CLI)

- `lib/config/default_configuration.json`: agregar `"output": "console"`.
- `lib/config/configuration.js`: accessor `output()`.
- `lib/config/parameters_parser.js`: nuevo `ParameterWithArgumentParser` con identificadores
  `['-o', '--output']` y propiedad `output`; validar valores permitidos (`console|tap|json`),
  análogo a la validación de idioma.

## Testing (self-tested)

- `tests/ui/tap_formatter_test.js` y `tests/ui/json_formatter_test.js`, espejando
  `tests/ui/formatter_test.js` (FakeConsole + helpers del runner, aserciones sobre salida exacta).
- Test de que `output: 'tap' | 'json'` instancia el formatter correcto (en `console_ui_test.js`
  o en un test de configuración).
- Validación de valor inválido de `output` en el parser de parámetros.

## Documentación

- Actualizar `README.md` y `README_es.md`: tabla de configuración (`output`) y flags CLI
  (`-o` / `--output`), con ejemplos de TAP y JSON.

## Fuera de alcance (YAGNI por ahora)

- API de reporters plugables custom.
- Salida a archivo (solo stdout).
