from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# MongoDB Configuration
MONGO_URI = os.getenv("MONGODB_ATLAS_URI", "mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net")
client = pymongo.MongoClient(MONGO_URI)
db = client["carrental"]
transactions_collection = db["transactions"]
vehicles_collection = db["vehicles"]

# ✅ Route to process a new transaction
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

        if not user_name or not vehicle_id or not pickup or not dropoff or not start or not end:
            return jsonify({"error": "Missing required transaction details"}), 400

        # ✅ Fetch the vehicle name from MongoDB
        vehicle = vehicles_collection.find_one({"carId": int(vehicle_id)})
        if not vehicle:
            return jsonify({"error": "Vehicle not found"}), 404

        vehicle_name = f"{vehicle['make']} {vehicle['model']}"

        # ✅ Generate a unique transaction_id
        transaction_id = str(uuid.uuid4())

        # ✅ Create transaction record
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

        # ✅ Insert transaction into database
        transactions_collection.insert_one(new_transaction)

        return jsonify({
            "status": "success",
            "transaction_id": transaction_id,
            "message": "Transaction created successfully"
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Route to fetch a transaction by ID
@app.route("/api/transactions/<string:transaction_id>", methods=["GET"])
def get_transaction(transaction_id):
    try:
        transaction = transactions_collection.find_one({"transaction_id": transaction_id}, {"_id": 0})
        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404
        return jsonify({"status": "success", "transaction": transaction}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Run the Flask server
if __name__ == "__main__":
    app.run(debug=True, port=5000)
