import json
import os
import urllib.request
from datetime import datetime

ORDERS_SERVICE_URL = os.environ.get('ORDERS_SERVICE_URL', 'http://localhost:8002')

def lambda_handler(event, context):
    records = event.get('Records', [])
    processed = 0

    for record in records:
        body = json.loads(record.get('body', '{}'))
        detail = body.get('detail', body)
        
        space_id = detail.get('space_id')
        available = detail.get('available')
        print(f"[Consumer] Evento recibido SpaceChanged: espacio {space_id} ahora disponible={available}")
        
        try:
            url = f"{ORDERS_SERVICE_URL}/events/space-changed"
            req = urllib.request.Request(
                url,
                data=json.dumps(detail).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                print(f"[Consumer] Notificado orders-service con status {response.status}")
                processed += 1
        except Exception as e:
            print(f"[Consumer] Error notificando a orders-service: {e}")

    return {"statusCode": 200, "body": json.dumps({"processed": processed})}
