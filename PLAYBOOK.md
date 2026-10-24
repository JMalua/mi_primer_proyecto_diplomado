cat << 'EOF' > PLAYBOOK.md
# 📘 Scrum + Trunk-Based Development (TBD) Playbook (Versión 3.0)
**Proyecto:** mi_primer_proyecto_diplomado  
**Facilitación / Equipo:** Taller de Adaptación de Scrum a TBD + Continuous Deployment

---

## 1. Diagnóstico del Flujo Actual
- **Flujo Identificado:**
  `Commit local` ➔ `Push a rama corta` ➔ `Pull Request (PR)` ➔ `CI (GitHub Actions / Tests)` ➔ `Auto-Deploy (Render)` ➔ `Merge a main` ➔ `Build & Deploy Producción`
- **🟢 Lo que funciona bien:** Pipeline automatizado de GitHub Actions con auto-deploy a Render y gestión de releases mediante ConfigCat.
- **🟡 Lo que genera fricción:** La espera de aprobaciones en PRs cuando se trabaja en ramas pequeñas y el control del estado de los toggles.
- **🔴 Lo que rompió el flujo o genera miedo:** Riesgo de desplegar código incompleto o romper la funcionalidad en producción si no está desacoplado el release del deploy.
- **Métricas objetivo:**
  * Vida máxima de una rama: < 24 horas.
  * Frecuencia de integración: Diaria a `main`.

---

## 2. Roles Adaptados a TBD + Continuous Deployment
- **Product Owner (PO):**
  * Prioriza por valor, riesgo de despliegue y tamaño de lote pequeño (*batch size*).
  * Es el dueño de las decisiones de negocio sobre la activación de **Feature Toggles** (ej. rollout progresivo 0% -> 50% -> 100%).
  * Participa activamente en el refinamiento exigiendo historias divididas en cortes verticales (*vertical slicing*).
- **Developers:**
  * Tienen responsabilidad colectiva de mantener la rama `main` siempre en verde y desplegable.
  * Producen cambios pequeños con pruebas unitarias asociadas.
  * Tienen *ownership* del pipeline de CI y monitorean activamente los status checks.
- **Scrum Master:**
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
- **Historia analizada:** `feat: agregar método resta() a Calculator con toggle de feature desactivado (#4)` y posterior rollout en UI (`#5`, `#6`).
- **¿Cómo cambia el Sprint Review?** No se espera a tener todas las operaciones matemáticas terminadas para mostrar valor. El backend de la resta se integró y desplegó en producción con el toggle apagado; luego se encendió progresivamente sin riesgo de regresión ni necesidad de un gran día de entrega (*Big Bang release*).
- **¿Cómo cambia la Retrospective?** Se evalúa la disciplina del ciclo: ¿el flag introdujo código muerto?, ¿los tests cubrieron ambos estados del flag (activo/inactivo)?, ¿cuántos minutos tardó el pipeline en validar el PR?

---

## 4. Definition of Done (DoD)
- [ ] Rama de vida corta (< 24 horas) con commits semánticos.
- [ ] Pruebas unitarias pasando al 100% de manera local y en el CI.
- [ ] Funcionalidad incompleta protegida por Feature Toggle (desactivada en producción).
- [ ] Status checks de GitHub Actions y auto-deploy en Render aprobados.
- [ ] Merge realizado a `main` sin conflictos ni builds rotos.
- [ ] Plan de retiro (*clean-up*) del toggle definido una vez completado el rollout.

---

## 5. Decisiones Técnicas y Pendientes
- **Gestión de Flags:** Uso de ConfigCat para alternar toggles en vivo sin necesidad de nuevo build ni despliegue.
- **Métricas DORA prioritarias:** *Deployment Frequency* (Frecuencia de despliegue) y *Lead Time for Changes* (Tiempo desde el commit hasta producción).

---

## 6. Definition of Ready (DoR) para TBD (Taller 4)
- [ ] Sliceada para integrarse a main en <= 1 día.
- [ ] Criterios de aceptación verificables en producción.
- [ ] Feature Toggle definido si aplica.
- [ ] Sin dependencias bloqueantes externas.

---

## 7. Planificación orientada a TBD
- **Sprint Goal:** "Al final del sprint los usuarios podrán multiplicar y dividir, aunque el historial siga en toggle."
- **Integración Día 1-2:** Multiplicación.
- **Integración Día 3-4:** División.
- **Integración Día 5+:** Historial y retiro de toggles.

---

## 8. Acuerdos de Cierre y Acciones Próximo Sprint (Taller 4)
- **Acción 1:** Toda nueva historia debe evaluarse contra los 4 criterios de TBD (Tamaño <= 1 día, Verticalidad, Feature Flag, Validación en producción) antes de entrar a Planning.
- **Acción 2:** En la Planning, el Sprint Goal se redactará obligatoriamente desacoplando despliegue de release ("podrán hacer X, aunque Y esté en toggle").
- **Acción 3:** Si un incremento no se puede integrar en menos de 24 horas, el equipo detiene nuevas tareas para ayudar a slicearlo o destrabar el pipeline.

---

## 9. Formato Oficial del Sprint Review en Continuous Deployment (Taller 6)

### 9.1 Principios del Review Continuo
1. **Demo en Producción Real:** Toda demostración se realiza sobre el entorno público desplegado en Render (`https://portal-tramites.onrender.com`), no en localhost.
2. **Desacople entre Despliegue y Liberación:** Se demuestra la presencia del incremento en `main` mientras su activación se controla en vivo con ConfigCat.
3. **Foco en Valor y Feedback:** Se valida si la funcionalidad resuelve el problema del usuario antes de encender el tráfico general.

### 9.2 Catálogo de Incrementos en Demo
* **Incremento 1: Calculadora de Liquidación Municipal**
  * *Problema:* Facilita el cálculo previo de tasas y trámites catastrales.
  * *Toggle:* `isRestaEnabled` (ConfigCat).
  * *Estado:* Desplegado y verificado.
* **Incremento 2: Pagos Express en 1 Clic (Caja Virtual)**
  * *Problema:* Reduce el abandono del pago suprimiendo la necesidad de rellenar formularios bancarios repetitivos.
  * *Toggle:* `pagos-express-v1` (ConfigCat).
  * *Estructura Demo:* Mostrar Render en estado OFF (pasarela estándar) ➔ Conmutar en ConfigCat a ON ➔ Refrescar Render y demostrar pago en 1 clic ➔ Preguntar al PO: *"¿Esto genera el valor esperado antes de habilitar el tráfico?"*.

---

## 10. Formato Oficial de la Sprint Retrospective (Taller 6)

### 10.1 Nuevos Focos de Inspección Obligatoria
En cada Retrospective se analizan las métricas del pipeline y la disciplina TBD:
* **Salud del Pipeline:** Frecuencia de fallos de CI, duración del deploy en Render, incidentes de health check y necesidad de rollbacks.
* **Disciplina TBD:** Cantidad de integraciones diarias a `main`, detección de ramas que superen las 24 horas de vida, y estado/higiene de los feature toggles.
* **Flujo de Valor:** Lead time desde el commit hasta Render y verificación de telemetría de uso real.

### 10.2 Análisis del Caso "Pagos Express"
* 🟢 **Lo que funcionó bien:** La funcionalidad se sliceó y desplegó automáticamente a producción en Render sin exponer riesgos prematuros gracias a `pagos-express-v1`.
* 🟡 **Lo que generó fricción:** Presión comercial por activar en viernes; rama viva durante 4 días debido a tests flaky en CI; falta de dashboards de métricas de pago.
* 🔴 **Lo que rompió el flujo / miedo:** Caída del health check durante 11 minutos con rollback manual; acumulación de 3 toggles obsoletos (+45 días) sin retirar.

### 10.3 Acciones de Mejora Acordadas (Máximo 3)
1. **Acción 1 (Estabilidad de Pipeline):** Cuarentenar/reparar tests flaky del CI y configurar políticas automáticas de rollback en Render ante fallos de health check.
2. **Acción 2 (Higiene de Toggles):** Todo Feature Toggle con más de 30 días de vida se programa obligatoriamente como deuda técnica a limpiar en el siguiente sprint.
3. **Acción 3 (DoR de Release):** Ninguna funcionalidad se activará a usuarios reales sin contar previamente con telemetría activa (tasa de errores 5xx y latencia).

---

## 11. Política Oficial de Liberación Segura de Valor (Taller 6)

1. **Ventanas de Liberación:**
   * Prohibida la activación de toggles para usuarios externos los días viernes o fines de semana sin guardia técnica activa.
   * Horario oficial de activación: Lunes a Jueves en horas diurnas de baja concurrencia.
2. **Estrategia Progresiva (Canary Rollout):**
   * **Fase 0 (Interno / Dogfooding):** Activación al 100% únicamente para usuarios internos y QA mediante reglas de correo en ConfigCat.
   * **Fase 1 (Canary 5%):** Activación al 5% de usuarios reales con ventana de observación activa de 24 horas.
   * **Fase 2 (Escalado Gradual):** Si las transacciones fallidas se mantienen < 0.5%, escalar progresivamente a 20%, 50% y 100%.
3. **Criterios de Rollback Inmediato:**
   * Conmutar de inmediato el toggle a **OFF** en ConfigCat (sin nuevo commit ni build) si:
     * La tasa de fallos en pasarela supera el 1%.
     * El tiempo de respuesta (p95) aumenta más de 500 ms.
     * Se registran excepciones de servidor no controladas.

---

### Ronda Final de Cierre (Taller 6)
> *"En una frase: Nuestro Review ahora valida valor observable en producción mediante toggles, y nuestra Retrospectiva protege la salud del pipeline y la disciplina diaria de integración."*
EOF
## 🚀 Despliegue en Render y Validación de Event-Driven Architecture

### 1. URLs de los Servicios en Producción
- **Catalog Service:** `https://catalog-service-ob28.onrender.com`
- **Orders Service:** `https://orders-service-i7v9.onrender.com`

### 2. Variables de Entorno Configuradas
- En `catalog-service`: `ORDERS_SERVICE_URL=https://orders-service-i7v9.onrender.com`
- En `orders-service`: `CATALOG_SERVICE_URL=https://catalog-service-ob28.onrender.com`
- Versión de Python: `3.11.8`

### 3. Matriz de Pruebas de Integración (Event-Driven)

| Escenario | Endpoint Ejecutado | Código HTTP Esperado | Resultado Obtenido |
| :--- | :--- | :--- | :--- |
| **Consultar Espacios** | `GET /spaces` (catalog) | `200 OK` | Devuelve lista con `id: 1` disponible. |
| **Disparar Evento (Inhabilitar)** | `PUT /spaces/1/availability` (catalog, `false`) | `200 OK` | `catalog` actualiza y notifica a `orders` vía webhook. |
| **Validar Bloqueo de Reserva** | `POST /orders?space_id=1...` (orders) | `400 Bad Request` | Rechazado: `"Space 1 is currently marked as unavailable via SpaceChanged event"`. |
| **Disparar Evento (Rehabilitar)** | `PUT /spaces/1/availability` (catalog, `true`) | `200 OK` | `catalog` notifica a `orders` la disponibilidad. |
| **Validar Creación Exitosa** | `POST /orders?space_id=1...` (orders) | `200 OK` | Orden creada con total calculado ($30.0) consultando al catálogo. |
