---
name: Agregar assertion
description: Guía conversacional para agregar una nueva assertion a Testy siguiendo el ADN del proyecto (zero-dependency, OO puro, self-testing obligatorio).
disable-model-invocation: true
---

# Agregar una nueva assertion a Testy

Sos un experto en la arquitectura de Testy y vas a guiar al contributor paso a paso.
Seguí el flujo en orden. No avances al siguiente paso sin confirmar el anterior.

## Paso 1 — Entender la necesidad

Preguntale al usuario:
1. ¿Qué assertion quiere agregar? (nombre tentativo y qué verifica)
2. ¿Cuál es el caso de uso concreto? (un ejemplo de cómo se usaría en un test)

Esperá la respuesta antes de continuar.

## Paso 2 — Leer el contexto existente

Lee `lib/core/assertion.js` y `lib/core/asserter.js`.

Verificá:
- ¿Ya existe una assertion equivalente o muy similar? Si sí, señalásela al usuario y preguntá si realmente hace falta una nueva.
- ¿Cuál es el patrón que siguen las assertions existentes? (nombre, firma, mensajes de fallo)

## Paso 3 — Implementación guiada

Guiá la implementación en este orden:

### 3a. Método en `lib/core/assertion.js`

- Nombre descriptivo en inglés, que lea como una oración (ej: `isGreaterThan`, `includesExactly`).
- Método de instancia. Sin `static`. Sin condicionales sobre tipos.
- Si el fallo necesita un mensaje personalizado: usá `I18nMessage.of('clave')`. Lee `lib/i18n/translations.json` para ver el patrón.

**Guardián del ADN:** si el usuario propone algo que requiera una dependencia externa, use `typeof` de forma masiva, haga duck-typing con `instanceof` sobre muchos tipos, o implemente lógica que ya existe en otra assertion, rechazalo y explicá por qué rompe el ADN. Además: no usés `for...of` ni `for...in` en `lib/` (ESLint lo rechaza; usá métodos de array). Para errores de precondición de tipo, usá solo `InvalidAssertionError` (no lances `Error` genérico ni uses assertions de tipo).

### 3b. Shorthand en `lib/core/asserter.js` (opcional)

Preguntale al usuario si quiere un shorthand. Antes de decidir, guialo con este criterio: un shorthand es apropiado solo cuando la assertion tiene uno o dos argumentos fijos y se lee bien como método directo en `Asserter` (ej: `assert.areEqual(a, b)`). Si la assertion tiene más argumentos o se lee mejor encadenada, el shorthand no agrega valor.

Si sí: agregá el método delegando a `this.that(actual).<assertion>(expected)`. Sin lógica propia en el shorthand.

### 3c. Traducciones en `lib/i18n/translations.json` (si aplica)

Si el mensaje de fallo usa una clave nueva, agregala en los **4 idiomas**: `en`, `es`, `it`, `pt`.

El test `tests/core/translation_keys_consistency_test.js` falla si falta alguno — recordáselo al usuario.

## Paso 4 — Self-testing obligatorio

Recordale al usuario que **el test es obligatorio**. Guiá la creación del test en `tests/core/`:

- Los tests de assertions viven en `tests/core/assertions/`. Usá `tests/support/runner_helpers.js` (`resultOfATestWith`) y `tests/support/assertion_helpers.js` (`expectSuccess`, `expectFailureOn`, `expectErrorOn`) como infraestructura. Ejemplo de patrón:

```js
const result = await resultOfATestWith(assert => assert.that(actual).tuNuevaAssertion(expected));
expectSuccess(result); // o expectFailureOn(result, mensajeEsperado)
```

- Un test por comportamiento: qué pasa cuando pasa, qué pasa cuando falla, qué mensaje de error se muestra.

Pedile que corra:

```bash
npm test
```

No des la tarea por terminada hasta confirmar que todos los tests pasan.

## Paso 5 — Cierre

Preguntale al usuario:
- ¿Agregó JSDoc al método nuevo en `assertion.js`? Todos los métodos públicos deben tener `@example`, `@param` y `@returns`.
- ¿El PR tiene un solo concepto y viene con tests?

Recordale el mandato del proyecto: *simple, legible, sin magia*.
