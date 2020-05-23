# Contributing

Se aceptan _Issues_ y _Pull Requests_. Existen plantillas para reportar los issues. Siempre ten en mente la sección de "Por qué?" donde se explica la filosofía de esta herramienta.

* Rama principal: `develop`. Por favor, abrir pull requests hacia `develop`.
* Utilizamos [Gitmoji](https://gitmoji.carloscuesta.me) como convención para anotar mensajes de commit. No es obligatorio pero si lo quieres seguir es bienvenido.

Al agregar una nueva funcionalidad, por favor agregar:
* test para dicha funcionalidad en el directorio `tests/core`
* si es posible, una entrada en el README indicando cómo utilizarla

Si solucionas un bug, por favor agregar:
* tests que verifican que el error está arreglado en el directorio `tests/core`

Github Actions ejecuta builds de integración continua. En cada build se ejecutan tres pasos:

* build en todas las versiones soportadas de Node
* chequeo estático de reglas de estilo via `eslint`
* ejecución de tests unitarios
