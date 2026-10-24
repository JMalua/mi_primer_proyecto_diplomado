import json
import os
import boto3
from datetime import datetime

eventbridge = boto3.client('events')
EVENT_BUS_NAME = os.environ.get('EVENT_BUS_NAME', 'default')

SPACES = [
    {"id": 1, "name": "Hot Desk Alpha", "price_per_hour": 15.0, "available": True},
    {"id": 2, "name": "Private Office Beta", "price_per_hour": 45.0, "available": True},
    {"id": 3, "name": "Meeting Room Gamma", "price_per_hour": 30.0, "available": True}
]

def lambda_handler(event, context):
    http_method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')

    if http_method == 'GET' and '/spaces' in path:
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(SPACES)
        }

    if http_method == 'PUT' and '/spaces/' in path:
        try:
            space_id = int(path.split('/')[-1])
            body = json.loads(event.get('body', '{}'))
            new_status = body.get('available')

            space = next((s for s in SPACES if s["id"] == space_id), None)
            if not space:
                return {"statusCode": 404, "body": json.dumps({"error": "Space not found"})}

            space["available"] = new_status

            event_payload = {
                "space_id": space_id,
                "name": space["name"],
                "available": new_status,
                "timestamp": datetime.utcnow().isoformat()
            }

            eventbridge.put_events(
                Entries=[{
                    'Source': 'coworking.catalog',
                    'DetailType': 'SpaceChanged',
                    'Detail': json.dumps(event_payload),
                    'EventBusName': EVENT_BUS_NAME
                }]
            )

            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"message": "Space updated and event emitted", "space": space})
            }
        except Exception as e:
            return {"statusCode": 500, "body": json.dumps({"error": str(e)})}

    return {"statusCode": 404, "body": json.dumps({"error": "Not Found"})}
