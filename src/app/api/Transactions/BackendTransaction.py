from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
import os
import uuid
from datetime import datetime

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB Configuration
MONGO_URI = os.getenv("MONGODB_ATLAS_URI", "mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net")
client = pymongo.MongoClient(MONGO_URI)
db = client["carrental"]
transactions_collection = db["transactions"]

# ✅ Route to process a new transaction
@app.route("/api/transactions", methods=["POST"])
def process_transaction():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        amount = data.get("amount")
        pickup = data.get("pickup")
        dropoff = data.get("dropoff")
        start = data.get("start")
        end = data.get("end")

        if not user_id or not amount:
            return jsonify({"error": "Missing required transaction details"}), 400

        new_transaction = {
            "transaction_id": str(uuid.uuid4()),
            "user_id": user_id,
            "amount": float(amount),
            "pickup": pickup,
            "dropoff": dropoff,
            "start": start,
            "end": end,
            "status": "completed",
            "created_at": datetime.utcnow(),
        }

        transactions_collection.insert_one(new_transaction)

        return jsonify({"message": "Transaction successful!", "transaction_id": new_transaction["transaction_id"]}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Route to fetch a transaction
@app.route("/api/transactions/<transaction_id>", methods=["GET"])
def get_transaction(transaction_id):
    try:
        transaction = transactions_collection.find_one({"transaction_id": transaction_id}, {"_id": 0})
        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404
        return jsonify({"status": "success", "transaction": transaction}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
