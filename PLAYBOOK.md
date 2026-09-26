# 📘 Scrum + Trunk-Based Development (TBD) Playbook
**Proyecto:** mi_primer_proyecto_diplomado

Este documento describe la adaptación de Scrum a un entorno de Despliegue Continuo (CD) y Trunk-Based Development (TBD).

---

## 1. Principios Acordados
1. **Trunk siempre desplegable:** La rama `main` debe mantenerse en verde y lista para producción en todo momento.
2. **Ramas de vida corta (Short-lived branches):** Las ramas duran menos de 24 horas antes de integrarse a `main`.
3. **CI Sagrado:** Si el pipeline de GitHub Actions falla en `main`, resolverlo es la máxima prioridad del equipo.
4. **Desacoplar Deploy de Release:** Cambios grandes se integran gradualmente usando Feature Flags o divisiones pequeñas.
5. **Responsabilidad compartida:** Todo el equipo vela por la estabilidad del build y los tests.

---

## 2. Roles Adaptados
* **Product Owner:** Prioriza por valor y tamaño de batch; define y autoriza Feature Toggles; participa en el sliceado fino de historias.
* **Developers:** Dueños colectivos de la salud de `main` y del pipeline de CI; entregan en lotes pequeños (< 300 líneas) con tests.
* **Scrum Master:** Protege la disciplina de integración diaria; remueve cuellos de botella en revisiones; ayuda a eliminar el miedo a integrar en `main`.

---

## 3. Definition of Done (DoD)
- [ ] Rama de vida corta (< 24 horas).
- [ ] Pruebas automatizadas pasando localmente.
- [ ] Linter y formato validados sin advertencias críticas.
- [ ] Pipeline de GitHub Actions ejecutado con éxito en el PR.
- [ ] Revisión de código (Code Review) aprobada.
- [ ] Merge realizado a `main` manteniendo el build verde.

---

## 4. Adaptación de Ceremonias
* **Daily Scrum:** Foco en integración: ¿Qué voy a integrar hoy a main y qué necesito para que sea seguro?
* **Sprint Planning:** Refinamiento y división vertical de historias para asegurar entregas diarias.
* **Sprint Review:** Demostración de incrementos reales ya integrados o desplegados en producción.
* **Sprint Retrospective:** Análisis de fricciones en el pipeline, tiempos de PR y salud de las integraciones.