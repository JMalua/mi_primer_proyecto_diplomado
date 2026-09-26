# 📋 Historias de Usuario Sliceadas (TBD)

### Historia 1: Pipeline CI Básico y Dockerfile
* **Objetivo:** Garantizar que cada commit ejecute validaciones automáticas y pruebe la construcción del contenedor.
* **Slice TBD:** Configuración básica de GitHub Actions (ci.yml) y Dockerfile.
* **Criterio de Aceptación:** El pipeline compila y valida en menos de 3 minutos.

### Historia 2: Endpoint de Healthcheck
* **Objetivo:** Permitir monitorear la disponibilidad de la aplicación en el despliegue.
* **Slice TBD:** Ruta simple /health con respuesta HTTP 200 { status: "ok" }.
* **Criterio de Aceptación:** Incluye prueba unitaria automatizada asociada.

### Historia 3: Feature Toggle para Funcionalidad Nueva
* **Objetivo:** Integrar código a main sin activar la funcionalidad prematuramente a los usuarios.
* **Slice TBD:** Condicional por variable de entorno (ENABLE_FEATURE_X=false).
* **Criterio de Aceptación:** Cobertura de pruebas validando el estado activo e inactivo.