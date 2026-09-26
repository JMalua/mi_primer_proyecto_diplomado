cat << 'EOF' > PLAYBOOK.md
# 📘 Scrum + Trunk-Based Development (TBD) Playbook
**Proyecto:** mi_primer_proyecto_diplomado  
**Facilitación / Equipo:** Taller de Adaptación de Scrum a TBD + Continuous Deployment

---

## 1. Diagnóstico del Flujo Actual
* **Flujo Identificado:**
  `Commit local` ➔ `Push a rama corta` ➔ `Pull Request (PR)` ➔ `CI (GitHub Actions / Tests)` ➔ `Vercel Deployment Preview` ➔ `Merge a main` ➔ `Build & Deploy Producción`
* **🟢 Lo que funciona bien:** Pipeline automatizado de GitHub Actions con pruebas unitarias rápidas y despliegues automáticos a Vercel.
* **🟡 Lo que genera fricción:** La espera de aprobaciones en PRs cuando se trabaja en ramas pequeñas y el control del estado de los toggles.
* **🔴 Lo que rompe el flujo o genera miedo:** Riesgo de desplegar código incompleto o romper la funcionalidad en producción si no está desacoplado el release del deploy.
* **Métricas objetivo:**
  * Vida máxima de una rama: < 24 horas.
  * Frecuencia de integración: Diaria a `main`.

---

## 2. Roles Adaptados a TBD + Continuous Deployment
* **Product Owner (PO):**
  * Prioriza por valor, riesgo de despliegue y tamaño de lote pequeño (*batch size*).
  * Es el dueño de las decisiones de negocio sobre la activación de **Feature Toggles** (ej. rollout progresivo 0% -> 50% -> 100%).
  * Participa activamente en el refinamiento exigiendo historias divididas en cortes verticales (*vertical slicing*).
* **Developers:**
  * Tienen responsabilidad colectiva de mantener la rama `main` siempre en verde y desplegable.
  * Producen cambios pequeños con pruebas unitarias asociadas.
  * Tienen *ownership* del pipeline de CI y monitorean activamente los status checks.
* **Scrum Master:**
  * Vela por la disciplina de integración continua diaria a `main`.
  * Elimina impedimentos que frenen revisiones rápidas de PRs y mitiga el miedo al despliegue frecuente.
  * Protege tiempo técnico para el mantenimiento de la infraestructura de CI/CD.

---

## 3. Artefactos y Ceremonias Adaptados
| Artefacto / Ceremonia | Versión Clásica | Adaptación TBD + CD |
| :--- | :--- | :--- |
| **Product Backlog** | Lista de grandes requerimientos | Historias sliceadas + plan de Feature Toggle + AC orientados a producción |
| **Sprint Backlog** | Paquete cerrado para 2-3 semanas | Tareas atómicas listas para ser integradas a `main` diariamente |
| **Incremento** | Entregable acumulado al final del sprint | Cualquier commit en `main` que pase el CI es un Incremento potencial desplegable |
| **Daily Scrum** | Tres preguntas de reporte de estado | *¿Qué voy a integrar hoy a `main` y qué necesito para que sea seguro?* |
| **Sprint Review** | Demostración formal de lo acumulado | Validación en vivo de lo que ya está en producción con datos y feedback real |
| **Sprint Retrospective** | Dinámica tradicional de mejora | Salud del pipeline, tiempo de vida de ramas y deuda técnica de toggles |

### Caso de Estudio: Análisis de Historia Sliceada (3.2 "Traduce tu realidad")
* **Historia analizada:** `feat: agregar método resta() a Calculator con toggle de feature desactivado (#4)` y posterior rollout en UI (`#5`, `#6`).
* **¿Cómo cambia el Sprint Review?** No se espera a tener todas las operaciones matemáticas terminadas para mostrar valor. El backend de la resta se integró y desplegó en producción con el toggle apagado; luego se encendió progresivamente sin riesgo de regresión ni necesidad de un gran día de entrega (*Big Bang release*).
* **¿Cómo cambia la Retrospective?** Se evalúa la disciplina del ciclo: ¿el flag introdujo código muerto?, ¿los tests cubrieron ambos estados del flag (activo/inactivo)?, ¿cuántos minutos tardó el pipeline en validar el PR?

---

## 4. Definition of Done (DoD)
- [ ] Rama de vida corta (< 24 horas) con commits semánticos.
- [ ] Pruebas unitarias pasando al 100% de manera local y en el CI.
- [ ] Funcionalidad incompleta protegida por Feature Toggle (desactivada en producción).
- [ ] Status checks de GitHub Actions y preview de Vercel aprobados.
- [ ] Merge realizado a `main` sin conflictos ni builds rotos.
- [ ] Plan de retiro (*clean-up*) del toggle definido una vez completado el rollout.

---

## 5. Decisiones Técnicas y Pendientes
* **Gestión de Flags:** Uso de variables de entorno / servicio tipo ConfigCat para alternar toggles sin necesidad de nuevo build.
* **Métricas DORA prioritarias:** *Deployment Frequency* (Frecuencia de despliegue) y *Lead Time for Changes* (Tiempo desde el commit hasta producción).
EOF
## 6. Definition of Ready (DoR) para TBD (Taller 4)
- [ ] Sliceada para integrarse a main en <= 1 día.
- [ ] Criterios de aceptación verificables en producción.
- [ ] Feature Toggle definido si aplica.
- [ ] Sin dependencias bloqueantes externas.

## 7. Planificación orientada a TBD
* Sprint Goal: "Al final del sprint los usuarios podrán multiplicar y dividir, aunque el historial siga en toggle."
* Integración Día 1-2: Multiplicación.
* Integración Día 3-4: División.
* Integración Día 5+: Historial y retiro de toggles.
