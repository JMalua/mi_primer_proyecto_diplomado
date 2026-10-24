# Informe de Chaos Engineering

## Test 1: Caída de servicio dependiente
- **Escenario**: Detención manual del contenedor `catalog-service` mediante `docker-compose stop catalog-service`.
- **Impacto**: `orders-service` no puede comunicarse con el catálogo, devolviendo código HTTP 503 ("Catalog service unavailable") a los clientes.
- **Tiempo de detección**: Inmediato tras timeout o rechazo de conexión en la llamada HTTP (3 segundos configurados en el cliente HTTPX).
- **Recuperación**: Se levanta nuevamente el servicio con `docker-compose start catalog-service`. La creación de órdenes vuelve al 100% de disponibilidad sin necesidad de reiniciar `orders-service`.

## Test 2: Cambio de contrato sin versionar
- **Escenario**: Modificación en el endpoint del catálogo cambiando el nombre del campo `price_per_hour` a `hourly_rate`.
- **Impacto**: `orders-service` arroja un error interno HTTP 500 al intentar acceder a la llave anterior inexistente en el JSON recibido.
- **Causa raíz**: Acoplamiento directo al esquema de datos sin contrato versionado ni validación defensiva de esquemas.
- **Solución propuesta**:
  1. Implementar versionado semántico en endpoints (`/api/v1/spaces`).
  2. Implementar pruebas de contrato automatizadas (ej. Pact) en el pipeline de CI/CD.
  3. Manejo defensivo en `orders-service` con modelos Pydantic compartidos o tolerancia a cambios en contratos.
