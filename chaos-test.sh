#!/bin/bash

echo "=== 1. Peticion en estado normal ==="
curl -s -o /dev/null -w "Status Code: %{http_code}\n" -X POST "http://localhost:8002/orders?space_id=1&user_email=normal@example.com&hours=2"

echo "=== 2. Apagando catalog-service (Falla) ==="
docker compose stop catalog-service

echo "=== 3. Peticion con catalogo caido (Esperado: 503) ==="
curl -s -w "\nStatus Code: %{http_code}\n" -X POST "http://localhost:8002/orders?space_id=1&user_email=fail@example.com&hours=2"

echo "=== 4. Restaurando catalog-service ==="
docker compose start catalog-service
sleep 3

echo "=== 5. Peticion tras recuperacion (Esperado: 200) ==="
curl -s -w "\nStatus Code: %{http_code}\n" -X POST "http://localhost:8002/orders?space_id=1&user_email=recovery@example.com&hours=2"
