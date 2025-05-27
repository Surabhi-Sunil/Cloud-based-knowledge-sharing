from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load environment variables
REGION = os.getenv("AWS_REGION")
TOPIC_ARN = os.getenv("SNS_TOPIC_ARN")
TABLE_NAME = os.getenv("DYNAMODB_TABLE")

# Initialize AWS clients
sns = boto3.client("sns", region_name=REGION)
dynamodb = boto3.resource("dynamodb", region_name=REGION)
event_table = dynamodb.Table(TABLE_NAME)

@app.route('/submit-event', methods=['POST'])
def submit_event():
    data = request.json

    print("🔔 Received POST request")

    title = data.get('title')
    description = data.get('description')
    tags = data.get('tags', [])
    sender = data.get('sender', 'Anonymous')
    lesson_type = data.get('lessonType')

    if not title or not description or not tags or not lesson_type:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Send notification
        message = f"📚 New Learning by {sender}\n\n{title}\n\n{description}"
        sns.publish(TopicArn=TOPIC_ARN, Message=message, Subject=title)

        # Log to DynamoDB
        event_table.put_item(Item={
            "event_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "title": title,
            "description": description,
            "tags": tags,
            "lesson_type": lesson_type,
            "sender": sender,
            "helpful_count": 0
        })

        return jsonify({"message": "Learning submitted successfully"}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/learnings', methods=['GET'])
def get_learnings():
    try:
        response = event_table.scan()
        items = response.get('Items', [])
        items.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        return jsonify(items), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/mark-helpful/<event_id>', methods=['POST'])
def mark_helpful(event_id):
    try:
        event_table.update_item(
            Key={'event_id': event_id},
            UpdateExpression="SET helpful_count = if_not_exists(helpful_count, :start) + :inc",
            ExpressionAttributeValues={':inc': 1, ':start': 0}
        )
        return jsonify({"message": "Marked as helpful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
