# Testy
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

[![ci](https://img.shields.io/travis/ngarbezza/testy.svg)](https://travis-ci.org/ngarbezza/testy)
![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@pmoo/testy.svg)
![dependencies](https://img.shields.io/david/ngarbezza/testy.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/6b6e4d071471379f31e7/maintainability)](https://codeclimate.com/github/ngarbezza/testy/maintainability)
![package-size](https://img.shields.io/bundlephobia/min/@pmoo/testy.svg)
![downloads](https://img.shields.io/npm/dt/@pmoo/testy.svg)
![activity](https://img.shields.io/github/commit-activity/w/ngarbezza/testy.svg)
![release-date](https://img.shields.io/github/release-date/ngarbezza/testy.svg)

Una simple biblioteca JS de testeo, para propósitos educativos. Disponible en npm: [@pmoo/testy](https://www.npmjs.com/package/@pmoo/testy).

[English version here](README.md)

## Instalación

`npm install --save-dev @pmoo/testy`

**Versiones de Node soportadas**: 8.x o mayor

## Uso

### Escribiendo suites de test 

Una suite de test no es más que un archivo de la siguiente forma:

```javascript
const { suite, test, assert } = require('@pmoo/testy');

suite('una suite de tests aburrida', () => {
  test('42 es 42, no nos sorprende', () => {
    assert.that(42).isEqualTo(42);
  });
});
```

Una suite representa un agrupamiento de tests, y se define llamando a la función `suite(name, body)`, que toma como parámetro el nombre de este agrupamiendo y una función sin argumentos, que representa el contenido de la suite. 

Un test se escribe llamando a la función `test(name, body)`, que toma como parámetro el nombre del caso de test y una función sin parámetros que representa el cuerpo del test. 

Dentro del test se pueden evaluar diferentes aserciones que están documentadas más adelante.

### Configurando Testy

Esta es la configuración recomendada. Agrega un archivo `tests.js` (o el nombre que gustes) con el siguiente contenido:

```javascript
const { Testy } = require('@pmoo/testy');

Testy.configuredWith({
  // ruta absoluta o relativa a la carpeta en donde vamos a ubicar nuestras suites de tests
  directory: './tests',
  // una expresión regular para indicar qué archivos se deben interpretar como suites de tests
  filter: /.*test.js$/,
  // idioma de los mensajes de salida. 'en' (inglés) es el valor por defecto; 'es' para Español es también una opción posible
  language: 'en',
  // Cuando es true, se detiene apenas encuentra un test que no pasa. Por defecto, es false
  failFast: false,
  // Fuerza a que los tests se ejecuten en un orden aleatorio. Por defecto, es false
  randomOrder: false,
}).run();
```

Estos son todos los parámetros de configuración que existen, ajustalos de acuerdo a tus necesidades.
Siguiendo este ejemplo de configuración, lo que se va a ejecutar es cada suite de test dentro del directorio `tests`, cuyos nombres de archivos finalicen con `*test.js`.

### Ejecutando Testy

Asumiendod que en el archivo `tests.js` tenemos la configuración de Testy creada anteriorente, podemos ejecutar los tests con:

```
$ node tests.js 
```

Además se puede agregar como script de `test` para tu `package.json`:

```
{
  ...
  "scripts": {
    "test": "node tests.js"
  },
  ...
}
```

Y luego ejecutar los tests utilizando `npm`:
 
```
$ npm test
```

### Ejecutar un único archivo de suite

**Nota:** esto puede ser util para ejecutar ejemplos pequeños o realizar pruebas rápidas; no es la configuración recomendada, en próximas versiones será deprecado.

```javascript
const { suite, test, assert } = require('@pmoo/testy');

suite('una suite aburrida', () => {
  test('true es obviamente true', () => assert.isTrue(true))
}).run();
```

(es similar al ejemplo inicial, pero con un `run()` al final)

### Ejemplos y aserciones disponibles

* Aserciones sobre valores booleanos:
  * `assert.that(boolean).isTrue()` o `assert.isTrue(boolean)`. Realiza una comparación estricta contra `true` (`object === true`)
  * `assert.that(boolean).isFalse()` o `assert.isFalse(boolean)`. Realiza una comparación estricta contra `false` (`object === false`)
* Aserciones de igualdad de objetos:
  * `assert.that(actual).isEqualTo(expected)` o `assert.areEqual(actual, expected)`.
  * `assert.that(actual).isNotEqualTo(expected)` o `assert.areNotEqual(actual, expected)`
  * Las aserciones de igualdad utilizan una comparación (_deep_) basada en el módulo `assert` de Node, y falla si los objetos que están siendo comparados tienen referencias cíclicas.
  * El criterio de igualdad en objetos no primitivos puede ser especificado:
    * Pasando una función adicional de comparación de dos parámetros a `isEqualTo(expected, criteria)` o `areEqual(actual, expected, criteria)`
    * Pasando un nombre de método que el objeto `actual` comprenda: `isEqualTo(expected, 'myEqMessage')` o `areEqual(actual, expected, 'myEqMessage')`
    * Por defecto, si `actual` entiende el mensaje `equals`, será utilizado para determinar la comparación
    * Si comparamos `undefined` con `undefined` usando `isEqualTo()`, el test fallará. Para chequear explícitamente por el valor `undefined`, se debe utilizar las aserciones `isUndefined()` o `isNotUndefined()` documentadas más adelante. 
* Validar si un objeto es o no `undefined`:
  * `assert.that(aValue).isUndefined()` o `assert.isUndefined(aValue)`
  * `assert.that(aValue).isNotUndefined()` o `assert.isNotUndefined(aValue)`
* Testeo de errores:
  * `assert.that(() => { ... }).raises(error)` o con una expresión regular `.raises(/part of message/)`
  * `assert.that(() => { ... }).doesNotRaise(error)`
  * `assert.that(() => { ... }).doesNotRaiseAnyErrors()`
* Aserciones numéricas:
  * `assert.that(aNumber).isNearTo(anotherNumber)`. Se puede pasar un segundo parámetro adicional que indica el número de dígitos de precisión que se van a considerar. Por defecto, son `4`.
* Inclusión de objetos en colecciones (`Array` y `Set`):
  * `assert.that(collection).includes(object)`
  * `assert.that(collection).doesNotInclude(object)`
  * `assert.that(collection).includesExactly(...objects)`
* Verificar si una colección es o no vacía
  * `assert.that(arrayOrString).isEmpty()`
  * `assert.that(arrayOrString).isNotEmpty()`

En la carpeta `tests` podrás encontrar más ejemplos y todas las posibles aserciones que puedes escribir. Testy está testeado en sí mismo.

### Otras funcionalidades

* **Ejecutar código antes de cada test**: como todas las bibliotecas y frameworks de testing poseen, existe una forma de ejecutar un código siempre antes dde cada test en una suite utilizando la función `before()` Ejemplo:

    ```javascript
    const { suite, test, before, assert } = require('@pmoo/testy');
    
    suite('usando la función before()', () => {
      let answer;
    
      before(() => {
        answer = 42;
      });
    
      test('la respuesta es 42', () => {
        assert.that(answer).isEqualTo(42);
      });
    });
    ```
* **Soporte para tests "pendientes"**: Un test que no tenga cuerpo, será reportado como pendiente (`[WIP]`) y no se considerará una falla.
* **Modo "fail-fast"**: Cuando está habilitado, se detiene apenas encuentra un test que falle o lance un error. Los tests restantes serán marcados como no ejecutados (_skipped_).
* **Ejecutar tests en orden aleatorio**: Una buena suite de tests no depende de un orden particular de tests para ejecutarse correctamentee. Activando esta configuración es una buena forma de asegurar eso.
* **Chequeo estricto de presencia de aserciones**: Si un test no evalúa ninguna aserción durante su ejecución, el resultado se considera un error. Básicamente, un test que no tiene aserciones es un "mal" test.
* **Explícitamente marcar un test como fallido o pendiente**: Ejemplos:

    ```javascript
    const { suite, test, fail, pending } = require('@pmoo/testy');
    
    suite('marcando tests explícitamente como fallidos o pendientes', () => {
      test('marcando como fallido', () =>
        fail.with('no debería estar aquí'));
      
      test('marcando como pendiente', () =>
        pending.dueTo('no hubo tiempo de finalizarlo'));
    });
    ```
    
    The output includes the messages provided:
    ```
    [FAIL] marcando como fallido
      => no debería estar aquí
    [WIP] marcando como pendiente
      => no hubo tiempo de finalizarlo
    ```

## Por qué?

Por qué tener una librería de tests cuando ya existen otras? La razón principal es que deseamos mantener la simplicidad, algo que no se puede encontrar en las principales herramientas de testing conocidas.

* **Cero dependencias:** Esta biblioteca no depende de ningún otro paquete de npm para funcionar, lo que facilita su instalación, y lo hace más rápido: esencial para obtener feedback inmediato desarrollando con TDD. Esto es algo bueno también para instalar en lugares donde la conexión a internet no es buena y no queremos perder tiempo descargando múltiples dependencias.
* **Código orientado a objetos entendible:** Esta herramienta es utilizada para enseñar, así que es muy común durante las clases mirar el código para entender cómo se ejecutan los tests, para entender lo que sucede. El objetivo es que los alumnos puedan comprender la herramienta e incluso realizar contribuciones a ella. Intentamos seguir buenas prácticas de diseño con objetos y de _clean code_ en general.
* **Conjunto único de funcionalidad:** Esta herramienta no sigue ninguna especificación ni trata de copiar la funcionalidad de enfoques conocidos de testing (como la forma "xUnit" la forma "xSpec"). La funcionalidad que existe, es la que tiene sentido que esté.  

## Para contribuir

Por favor revisar la [guía para contribuciones](CONTRIBUTING_es.md).

## Contribuyentes ✨

Muchas gracias a estas maravillosas personas ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/JavierGelatti"><img src="https://avatars2.githubusercontent.com/u/993337?v=4" width="100px;" alt="Facundo Javier Gelatti"/><br /><sub><b>Facundo Javier Gelatti</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=JavierGelatti" title="Tests">⚠️</a> <a href="https://github.com/ngarbezza/testy/commits?author=JavierGelatti" title="Code">💻</a></td>
    <td align="center"><a href="https://codepen.io/TomerBenRachel/"><img src="https://avatars2.githubusercontent.com/u/23402988?v=4" width="100px;" alt="Tomer Ben-Rachel"/><br /><sub><b>Tomer Ben-Rachel</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=TomerPacific" title="Tests">⚠️</a> <a href="https://github.com/ngarbezza/testy/commits?author=TomerPacific" title="Code">💻</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

Este proyecto sigue la convención de [all-contributors](https://github.com/all-contributors/all-contributors). Se aceptan contribuciones de todo tipo!
