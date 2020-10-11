# Contributing

Se aceptan _Issues_ y _Pull Requests_. Siempre ten en mente la sección de "Por qué?" donde se explica la filosofía de esta herramienta.

## Para reportar _issues_

Existen diferentes _issue types_ para diferentes usos. Por favor, ajústate a alguno de ellos a menos que tengas una razón
fuerte para no hacerlo. Si envías reportes de bugs, sería genial si incluyes también un ejemplo minimal que demuestre el
problema, como una suite o un test de ejemplo.

## Para enviar cambios

* Rama principal: `develop`. Por favor, abrir pull requests hacia `develop`.
* Utilizamos [Gitmoji](https://gitmoji.carloscuesta.me) como convención para anotar mensajes de commit. No es obligatorio pero si lo quieres seguir es bienvenido.

Al agregar una nueva funcionalidad, por favor agregar:
* test para dicha funcionalidad en el directorio `tests/core`
* si es posible, una entrada en el README indicando cómo utilizarla

Si solucionas un bug, por favor agregar:
* tests que verifican que el error está arreglado en el directorio `tests/core`

Github Actions ejecuta builds de integración continua. En cada build se ejecutan cuatro pasos:

* build en todas las versiones soportadas de Node
* chequeo estático de reglas de estilo via `eslint`
* ejecución de tests unitarios
* análisis de cobertura de tests y reporte
