# Ideas de AI para Testy

> Documento vivo de exploración.
> Última actualización: 2026-06-23.

**Leyenda de estados:** ✅ hecho · 🔄 en curso · 🔲 pendiente

El objetivo de este documento es recolectar ideas sobre cómo incorporar AI en Testy
en tres dimensiones: el **ciclo de vida de desarrollo**, la **evolución del producto**
y la **experiencia de los usuarios** (alumnos y docentes). No busca resolver un problema
puntual todavía, sino servir de materia prima para priorizar más adelante.

## Contexto y ADN del proyecto (filtro para las ideas)

- **Es educativo**: se usa para enseñar TDD/testing; el código se lee en clase.
- **Su valor central es la simplicidad**: zero/mínimas dependencias, "no dark magic",
  OOP legible inspirado en Smalltalk.
- **Es OSS con contributors** y ya hay rastros de AI en el desarrollo (commits `copilot/fix-*`).
- **Tiene i18n** (en/es/it), mutation testing (Stryker), coverage (c8) y ADRs en `doc/decisions`.

**Tensión de diseño que atraviesa todo**: muchas ideas obvias de "meter un LLM adentro de
la herramienta" chocarían con el zero-dependency y con el propósito pedagógico (si la AI
escribe los tests, el alumno no aprende). Las ideas más interesantes respetan ese ADN.

---

## Eje 1 — AI en el ciclo de vida de desarrollo (construir y mantener Testy)

### Comunidad y contribución (OSS educativo)
- **Bot de bienvenida a contributors**: sugiere "good first issues" según el perfil del que llega.
- **Traducción de issues/PRs**: contributors de varios países; bajar la barrera del idioma.
- **Auto-descripción de PRs**: redactar la descripción a partir del diff, en el tono del proyecto.
- **Revisor de checklist de CONTRIBUTING**: que cada PR venga con tests, lint ok y respete "self-tested".
- **Detección de issues/PRs duplicados** o ya resueltos.
- **Digest semanal para el maintainer**: estado del repo, PRs estancados, issues calientes.

### Calidad y testing del propio Testy
- **Asistente de mutantes de Stryker**: explica cada mutante sobreviviente en lenguaje natural
  y propone el test que lo mata.
- **Gaps de cobertura → casos sugeridos** (apoyado en c8).
- **Meta-testing**: como Testy es self-tested, un agente que verifica que los tests de Testy
  cumplan las buenas prácticas que la herramienta predica (naming, un concepto por test, sin
  dependencia de orden).
- **Caza de flaky tests**: aprovechar `randomOrder` para exponer dependencias de orden.

### Documentación e i18n
- **Sincronización README ↔ README_es ↔ jsdoc** cuando cambia la API pública.
- **i18n asistido**: generar/revisar mensajes en en/es/it y habilitar nuevos idiomas con revisión humana.
- **Doc-tests**: verificar que los ejemplos del README realmente corran y no se desactualicen.
- **Release notes/changelog** generados desde los commits.

### Arquitectura y decisiones
- **Asistente de ADRs** para `doc/decisions`: ayudar a redactar y mantener las decisiones.
- **Conformance de arquitectura**: chequear que el código nuevo respete el estilo OO y los
  patrones existentes ("no dark magic").
- **Guardián de simplicidad**: bloquea/avisa en CI cuando un PR agrega dependencias, sube
  complejidad o introduce magia. Defiende el valor #1 del proyecto.
- **Triage de Dependabot**: evaluar si un bump de dependencia/Node es seguro de mergear.

### Meta: toolkit de desarrollo con AI
- **`CLAUDE.md` + skills propias de Testy**: que cualquier maintainer/contributor tenga un
  asistente consistente que ya conoce la arquitectura, el estilo y las convenciones (dogfooding).

---

## Eje 2 — AI para la evolución del producto (qué podría ofrecer Testy)

> **Regla de oro**: la AI vive **fuera del core**, como capa/plugin opcional (p.ej. un paquete
> aparte `@pmoo/testy-ai` o un reporter enchufable). Así no se rompe zero-dependency ni la
> legibilidad para enseñar.

### Diagnóstico de fallos
- **Explicación en lenguaje natural** de por qué falló un assert, con un diff legible.
- **Sugerencia de fix mínimo** para el fallo.
- **Errores vs. fallos**: explicar la excepción y señalar el lugar probable.

### Asistencia al escribir tests
- **Sugerir la assertion correcta** del catálogo (chico y bien definido) según el valor/intención.
- **Test sin assertions** (ya lo detecta) → proponer qué assertion agregar.
- **Detección de smells**: nombres pobres, varios asserts no relacionados, prueba de
  implementación en vez de comportamiento.

### Reportes
- **Reporter "explicado"**: resume la corrida en NL ("3 fallos, todos por manejo de `undefined`").
- **Priorización de fallos**: cuál conviene arreglar primero.

### Integración con el ecosistema de agentes
- **MCP server de Testy**: que un agente (Claude Code, etc.) pueda correr tests, leer resultados
  e iterar TDD de forma estructurada. Potente y respeta la simplicidad porque el LLM queda afuera.
- **Modo "watch + asistente"**: feedback continuo mientras se desarrolla.

### Configuración
- **Sugerir `.testyrc.json`** apropiado para el proyecto detectado.

### ⚠️ Anti-features (a discutir, no a adoptar a ciegas)
- **Generación automática de tests completos**: cómoda para uso profesional, pero **mata el
  aprendizaje** en contexto educativo. Decidir conscientemente si entra y con qué guardas.

---

## Eje 3 — AI desde el punto de vista de los usuarios (alumnos y docentes)

> Probablemente el eje **más alineado con la identidad** de Testy: una herramienta para *enseñar*
> a testear.

### Para el alumno
- **Tutor de TDD socrático**: "¿cuál es el test más chico que falla?"; detecta si se escribe
  mucho código sin un test que lo guíe; acompaña red-green-refactor sin resolver.
- **Detección de anti-patrones en SUS tests**, con explicación didáctica adaptada al nivel.
- **"Explicame este concepto" leyendo el código de Testy**: como el código es legible a
  propósito, sirve de material (equality profunda, identidad, etc.).
- **Hints progresivos en katas**: pistas graduales, nunca la solución directa.
- **Feedback de naming y diseño** de tests.

### Para el docente
- **Generador de katas/ejercicios** con dificultad graduada.
- **Evaluación asistida de entregas**: correr tests + analizar calidad + redactar devolución.
- **Variantes de un mismo ejercicio** para evitar copia, y **detección de similitud/plagio**.
- **Dashboard de la clase**: qué conceptos cuestan más.
- **Generación de ejemplos en vivo** durante la clase.

### Experiencia de aprendizaje
- **Onboarding interactivo**: "tu primer test con Testy".
- **Mensajes de error multinivel**: explicación para principiante vs. avanzado.
- **Tutoría multilingüe nativa**: aprovechar el i18n para acompañar al alumno en su idioma.

---

## Transversales (cruzan varios ejes)

- **`CLAUDE.md` + skills + MCP server**: una misma inversión sirve para desarrollo (eje 1),
  producto (eje 2) y enseñanza (eje 3).
- **Decisión de arquitectura única**: AI siempre como capa opcional → hace coherentes a casi
  todas las ideas.
- **Privacidad**: en contexto educativo/institucional, ¿se manda código de alumnos a un LLM
  externo? Condiciona qué se puede ofrecer.
- **Costo y acceso**: ¿quién paga los tokens en un aula? Abre la puerta a **modelos locales**
  (Ollama, etc.) como opción.

---

## Drivers de priorización

Criterios que guían qué iniciativas valen más la pena (definidos por el maintainer):

1. **Portfolio y competitividad profesional**: Testy es el "caballo de batalla" para crecer
   como desarrollador y mantenerse competitivo ante los cambios de la industria. Lo innovador
   suma puntos.
2. **Componente filosófico**:
   - **Simplicidad como ventaja de costo**: poder *demostrar* que la simplicidad de la
     herramienta se traduce en menos costos, incluso involucrando LLMs.
   - **Reflexión pedagógica**: cómo aprendemos los fundamentos de la programación en tiempos
     de AI.
3. **Poner en valor el repo (filosofía e historia)** por sobre otras herramientas de testing.
   Competir con herramientas productivas no es objetivo primario, pero sí interesante de explorar.

## Priorización

### Pesos acordados (2026-06-05)

- **Driver dominante: D2a — simplicidad como costo.** Priorizamos lo que permite *demostrar*
  que la simplicidad de Testy se traduce en menos costo al usarlo con LLMs.
- **Secuencia: quick wins primero.** Empezar por lo de bajo esfuerzo que ya alimenta la tesis
  de costo, antes de la apuesta grande.
- D1 (portfolio), D2b (pedagogía) y D3 (poner en valor el repo) actúan como desempate.

### Núcleo coherente

Las iniciativas top se auto-refuerzan en una cadena de dependencias:

```
output LLM-friendly  ─┐
CLAUDE.md + skills   ─┼─►  MCP server  ─►  Benchmark de costo agéntico (la tesis)
                                              (Testy vs Jest/Vitest)
```

### Roadmap por fases (lente D2a-dominante)

**Fase 0 — Quick wins que alimentan la tesis de costo**
1. ✅ **Output / reporter LLM-friendly**: modo de salida compacto y parseable (estructurado o
   tipo TAP), pensado para que un agente lo consuma con pocos tokens. Es la base medible de la
   tesis y de bajo esfuerzo. _(D2a alto, costo bajo)_ — [PR #382](https://github.com/ngarbezza/testy/pull/382)
2. ✅ **`CLAUDE.md` + skills propias**: dogfooding; deja a Testy "listo para agentes" y demuestra
   que una tool simple se integra sin fricción. _(costo bajo, habilitador)_ — [PR #389](https://github.com/ngarbezza/testy/pull/389)

~~**Fase 1 — Keystone**~~  
~~3. **MCP server de Testy**~~ — **descartado**. El output JSON/TAP ya permite que un agente corra
`npm test` vía Bash y lea resultados estructurados. Un MCP server agregaría ergonomía marginal
(herramientas con nombre semántico, objetos tipados) pero violaría zero-dependencies — cualquier
implementación real requiere el SDK de MCP. El caso de uso primario (agente haciendo TDD) está
cubierto sin él, y el benchmark de costo funciona igual con Bash + JSON output.

**Fase 1 — Flagship: la tesis hecha carne**
3. 🔄 **Benchmark de costo agéntico**: experimento medible (tokens, costo, nº de iteraciones hasta
   verde) de un agente haciendo TDD con Testy vs. herramientas pesadas. Material publicable
   (blog/charla/README). _(D2a alto, D1/D3 alto, costo medio; depende de items 1 y 2)_ — repo:
   [testy-benchmark](https://github.com/ngarbezza/testy-benchmark)

### En el radar (segunda ola)

- 🔲 **Guardián de simplicidad (CI)**: predica con el ejemplo; refuerza el relato (D3).
- 🔲 **Tutor de TDD socrático**: la gran apuesta **pedagógica** (D2b). Candidata fuerte a
  "identidad AI" de Testy.
- 🔲 **Asistente de mutantes (Stryker)**, **explicación de fallos en NL**, **i18n asistido**.
- 🔲 **Bots de comunidad / dashboards docentes**: valiosos, pero bajos contra los drivers actuales.
