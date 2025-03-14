from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# MongoDB Configuration
MONGO_URI = os.getenv("MONGODB_ATLAS_URI")
client = pymongo.MongoClient(MONGO_URI)
db = client["carrental"]
transactions_collection = db["transactions"]
vehicles_collection = db["vehicles"]

@app.route("/api/transactions", methods=["POST"])
def process_transaction():
    try:
        data = request.get_json()
        user_name = data.get("user_name") 
        vehicle_id = data.get("vehicle_id")
        amount = data.get("amount")
        pickup = data.get("pickup")
        dropoff = data.get("dropoff")
        start = data.get("start")
        end = data.get("end")

        if not all([user_name, vehicle_id, pickup, dropoff, start, end]):
            return jsonify({"error": "Missing required transaction details"}), 400

        vehicle = vehicles_collection.find_one({"carId": int(vehicle_id)})
        if not vehicle:
            return jsonify({"error": "Vehicle not found"}), 404

        vehicle_name = f"{vehicle['make']} {vehicle['model']}"

        transaction_id = str(uuid.uuid4())

        new_transaction = {
            "transaction_id": transaction_id,
            "user_name": user_name,
            "vehicle_id": vehicle_id,
            "vehicle_name": vehicle_name,
            "amount": amount,
            "pickup": pickup,
            "dropoff": dropoff,
            "start": start,
            "end": end,
            "status": "active",
            "created_at": datetime.utcnow()
        }

        transactions_collection.insert_one(new_transaction)

        return jsonify({
            "status": "success",
            "transaction_id": transaction_id,
            "message": "Transaction created successfully"
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def handler(event, context):
    return app(event, context)
