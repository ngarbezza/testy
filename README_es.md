# Testy

![ci](https://img.shields.io/github/workflow/status/ngarbezza/testy/Node%20CI/main?logo=github)
\
[![maintainability](https://img.shields.io/codeclimate/maintainability/ngarbezza/testy?logo=code-climate)](https://codeclimate.com/github/ngarbezza/testy)
[![tech-debt](https://img.shields.io/codeclimate/tech-debt/ngarbezza/testy?logo=code-climate)](https://codeclimate.com/github/ngarbezza/testy)
[![coverage](https://img.shields.io/codeclimate/coverage/ngarbezza/testy?logo=code-climate)](https://codeclimate.com/github/ngarbezza/testy)
\
![open-issues](https://img.shields.io/github/issues-raw/ngarbezza/testy?logo=github)
![closed-issues](https://img.shields.io/github/issues-closed-raw/ngarbezza/testy?logo=github)
![open-prs](https://img.shields.io/github/issues-pr-raw/ngarbezza/testy?logo=github)
 \
![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@pmoo/testy.svg?logo=npm)
![downloads](https://img.shields.io/npm/dt/@pmoo/testy.svg?logo=npm)
![dependencies](https://img.shields.io/david/ngarbezza/testy.svg?logo=dependabot)
\
![package-size](https://img.shields.io/bundlephobia/min/@pmoo/testy.svg?logo=npm)
![activity](https://img.shields.io/github/commit-activity/m/ngarbezza/testy?logo=npm)
![release-date](https://img.shields.io/github/release-date/ngarbezza/testy.svg?logo=npm)
\
[![all-contributors](https://img.shields.io/github/all-contributors/ngarbezza/testy?logo=open-source-initiative)](#Contribuyentes)

Una simple herramienta de testeo en Javascript, para propósitos educativos. Disponible en npm: [@pmoo/testy](https://www.npmjs.com/package/@pmoo/testy).

:arrow_right: [English version here](README.md)
:construction_worker: [Guías para contribuir](CONTRIBUTING_es.md)

## Para comenzar

`npm install --save-dev @pmoo/testy` (si utilizas [npm](https://www.npmjs.com/)) \
`yarn add --dev @pmoo/testy` (si utilizas [yarn](https://classic.yarnpkg.com/en/))

**Versiones de Node soportadas**: 12.x o mayor (todas las versiones con soporte activo
o de seguridad listadas [aquí](https://endoflife.date/nodejs))

## Uso

### Escribiendo suites de test 

Una suite de test no es más que un archivo cuyo nombre finaliza con `_test.js` y tiene la siguiente forma:

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

### Ejecutando Testy

Puedes ejecutar una suite de test con el siguiente comando:

```
$ npx testy my_test.js 
```

Or, al ejecutar `testy` sin argumentos se ejecutarán todos los tests, por defecto, que están dentro del directorio `tests`:

```
$ npx testy 
```

También se puede registrar `testy` como script de `test` script en `package.json`:

```
{
  ...
  "scripts": {
    "test": "npx testy"
  },
  ...
}
```

Para luego ejecutar los tests con `npm test` o `yarn test`.

### Configurando Testy

Testy se puede configurar a través de un archivo llamado `.testyrc.json` que debe ser declarado en el directorio raíz del proyecto. Puedes usar la siguiente configuración como plantilla (los valores aquí mencionados son los valores por defecto):

```
{
  "directory": "./tests",   // directorio con los archivos de test
  "filter": ".*_test.js$",  // qué convención utilizar para el nombrado de archivos de test
  "language": "en",         // idioma de los mensajes de salida ("en" y "es" soportados por el momento)
  "failFast": false,        // habilita/deshabilita el modo "fail fast" (detener la ejecución en el primer fallo)
  "randomOrder": false      // habilita/deshabilita la ejecución de tests en orden aleatorio.
}
```

Estos son todos los parámetros de configuración que existen, ajústalos de acuerdo a tus necesidades.
Siguiendo este ejemplo de configuración, lo que se va a ejecutar es cada suite de test dentro del directorio `tests`, cuyos nombres de archivos finalicen con `*test.js`.

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
* Aserciones de identidad de objetos:
  * `assert.that(actual).isIdenticalTo(expected)` o `assert.areIdentical(actual, expected)`
  * `assert.that(actual).isNotIdenticalTo(expected)` o `assert.areNotIdentical(actual, expected)`
  * Las aserciones de identidad comprueban si dos referencias apuntan al mismo objeto utilizando el operador `===`.
* Validar si un objeto es o no `undefined`:
  * `assert.that(aValue).isUndefined()` o `assert.isUndefined(aValue)`
  * `assert.that(aValue).isNotUndefined()` o `assert.isNotUndefined(aValue)`
* Validar si un objeto es o no `null`:
  * `assert.that(aValue).isNull()` o `assert.isNull(aValue)`
  * `assert.that(aValue).isNotNull()` o `assert.isNotNull(aValue)`
* Testeo de errores:
  * `assert.that(() => { ... }).raises(error)` o con una expresión regular `.raises(/part of message/)`
  * `assert.that(() => { ... }).doesNotRaise(error)`
  * `assert.that(() => { ... }).doesNotRaiseAnyErrors()`
* Aserciones numéricas:
  * `assert.that(aNumber).isNearTo(anotherNumber)`. Se puede pasar un segundo parámetro adicional que indica el número de dígitos de precisión que se van a considerar. Por defecto, son `4`.
* Aserciones sobre strings:
  * `assert.that(string).matches(regexOrString)` o `assert.isMatching(string, regexOrString)`
* Inclusión de objetos en colecciones (`Array` y `Set`):
  * `assert.that(collection).includes(object)`
  * `assert.that(collection).doesNotInclude(object)`
  * `assert.that(collection).includesExactly(...objects)`
* Verificar si una colección es o no vacía:
  * `assert.that(collection).isEmpty()` or `assert.isEmpty(collection)`
  * `assert.that(collection).isNotEmpty()` or `assert.isNotEmpty(collection)`
  * la colección a verificar puede ser un `Array`, un `String` o un `Set`

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
* **Soporte para tests pendientes**: Un test que no tenga cuerpo, será reportado como pendiente (`[WIP]`) y no se considerará una falla.
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
    
    Al ejecutar veremos los siguientes mensajes:
    ```
    [FAIL] marcando como fallido
      => no debería estar aquí
    [WIP] marcando como pendiente
      => no hubo tiempo de finalizarlo
    ```

## ¿Por qué?

¿Por qué tener una herramienta de tests cuando ya existen otras? La razón principal es que deseamos mantener la simplicidad, algo que no se puede encontrar en las principales herramientas de testing conocidas.

* **Cero dependencias:** Este proyecto no depende de ningún otro paquete de npm para funcionar, lo que facilita su instalación, y lo hace más rápido: esencial para obtener feedback inmediato desarrollando con TDD. Esto es algo bueno también para instalar en lugares donde la conexión a internet no es buena y no queremos perder tiempo descargando múltiples dependencias.
* **Código orientado a objetos entendible:** Esta herramienta es utilizada para enseñar, así que es muy común durante las clases mirar el código para entender cómo se ejecutan los tests, para entender lo que sucede. El objetivo es que los alumnos puedan comprender la herramienta e incluso realizar contribuciones a ella. Intentamos seguir buenas prácticas de diseño con objetos y de _clean code_ en general.
* **Conjunto único de funcionalidad:** Esta herramienta no sigue ninguna especificación ni trata de copiar la funcionalidad de enfoques conocidos de testing (como la forma "xUnit" la forma "xSpec"). La funcionalidad que existe, es la que tiene sentido que esté.  

["Design Principles Behind Smalltalk"](https://www.cs.virginia.edu/~evans/cs655/readings/smalltalk.html) es una gran fuente de inspiración para este trabajo. Intentamos seguir los mismos principios aquí.

## Para contribuir

Por favor revisar la [guía para contribuciones](CONTRIBUTING_es.md).

## Contribuyentes ✨

Muchas gracias a estas maravillosas personas ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/JavierGelatti"><img src="https://avatars2.githubusercontent.com/u/993337?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Facundo Javier Gelatti</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=JavierGelatti" title="Tests">⚠️</a> <a href="https://github.com/ngarbezza/testy/commits?author=JavierGelatti" title="Code">💻</a></td>
    <td align="center"><a href="https://codepen.io/TomerBenRachel/"><img src="https://avatars2.githubusercontent.com/u/23402988?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tomer Ben-Rachel</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=TomerPacific" title="Tests">⚠️</a> <a href="https://github.com/ngarbezza/testy/commits?author=TomerPacific" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/abraaoduarte"><img src="https://avatars2.githubusercontent.com/u/6676804?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Abraão Duarte</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=abraaoduarte" title="Code">💻</a></td>
    <td align="center"><a href="http://adico.tech"><img src="https://avatars0.githubusercontent.com/u/5412270?v=4?s=100" width="100px;" alt=""/><br /><sub><b>adico</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=adico1" title="Code">💻</a> <a href="https://github.com/ngarbezza/testy/commits?author=adico1" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/ask-imran"><img src="https://avatars0.githubusercontent.com/u/20487103?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Askar Imran</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=ask-imran" title="Code">💻</a> <a href="https://github.com/ngarbezza/testy/commits?author=ask-imran" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://www.nigelyong.com/"><img src="https://avatars2.githubusercontent.com/u/23243585?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nigel Yong</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=niyonx" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/chelsieng"><img src="https://avatars1.githubusercontent.com/u/60008262?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Chelsie Ng</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=chelsieng" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/trochepablo"><img src="https://avatars2.githubusercontent.com/u/18213369?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Pablo T</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=trochepablo" title="Tests">⚠️</a> <a href="https://github.com/ngarbezza/testy/commits?author=trochepablo" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/franciscojaimesfreyre"><img src="https://avatars.githubusercontent.com/u/10203729?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Francisco Jaimes Freyre</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=franciscojaimesfreyre" title="Code">💻</a> <a href="https://github.com/ngarbezza/testy/commits?author=franciscojaimesfreyre" title="Tests">⚠️</a> <a href="https://github.com/ngarbezza/testy/commits?author=franciscojaimesfreyre" title="Documentation">📖</a></td>
    <td align="center"><a href="https://rpt.altervista.org"><img src="https://avatars.githubusercontent.com/u/1763919?v=4?s=100" width="100px;" alt=""/><br /><sub><b>giovannipessiva</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=giovannipessiva" title="Translation">🌍</a></td>
    <td align="center"><a href="https://abhikhatri67.github.io/"><img src="https://avatars.githubusercontent.com/u/15958423?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Abhishek Khatri</b></sub></a><br /><a href="https://github.com/ngarbezza/testy/commits?author=abhikhatri67" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

Este proyecto sigue la convención de [all-contributors](https://github.com/all-contributors/all-contributors). Se aceptan contribuciones de todo tipo!
