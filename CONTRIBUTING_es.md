# Contributing

Se aceptan _Issues_ y _Pull Requests_. Siempre ten en mente la sección de "Por qué?", donde se explica la filosofía de
esta herramienta.

## Para reportar _issues_

Existen diferentes _issue types_ para diferentes usos. Por favor, ajústate a alguno de ellos a menos que tengas una
razón fuerte para no hacerlo. Si envías reportes de bugs, sería genial si incluyes también un ejemplo minimal que
demuestre el problema, como una suite o un test de ejemplo.

## Para enviar cambios

* Rama principal: `main`. Por favor, abrir pull requests hacia `main`.
* Utilizamos [Gitmoji](https://gitmoji.carloscuesta.me) como convención para anotar mensajes de commit. No es
  obligatorio, pero si lo quieres seguir es bienvenido.
* Firma tus commits. Hay un chequeo que valida esto al momento de evaluar un _pull request_.

Al agregar una nueva funcionalidad, por favor agregar:

* test para dicha funcionalidad en el directorio `tests/core`
* si es posible, una entrada en el README indicando cómo utilizarla
* comentarios JSDoc para todas las clases y métodos públicos, idealmente con ejemplos para ilustrar su uso

Si solucionas un bug, por favor agregar:

* tests que verifican que el error está arreglado en el directorio `tests/core`

Si agregas una función utilitaria, por favor ubícala en el módulo `Utils`. De esa manera, podemos controlar la
complejidad de este tipo de código de manera centralizada, y maximizamos la reutilización en las diferentes partes
de la herramienta.

Si agregas traducciones, solo necesitas cambiar el archivo de `translations.json` y los idiomas o claves que agregues
van a estar automáticamente soportadas.

Github Actions ejecuta builds de integración continua. En cada build se ejecutan cuatro pasos:

* build en todas las versiones soportadas de Node
* chequeo estático de reglas de estilo via `eslint`
* ejecución de tests unitarios
* análisis de cobertura de tests y calidad del código con sus respectivos reportes (QLTY y Sonarcloud)

También existe un build que corre únicamente en el branch principal y calcula el porcentaje de mutation score,
reportándolo al dashboard de Stryker.

## Conventions and standards

Este proyecto
utiliza [Registros de Decisiones Arquitecturales (Architectural Decision Records, ADR)](https://adr.github.io/).
El directorio `doc/decisions` contiene todas las decisiones tomadas hasta el momento. Por favor, verifica que los
cambios que envíes estén en conformidad con estas decisiones.
