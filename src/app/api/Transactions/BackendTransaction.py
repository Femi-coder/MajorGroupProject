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
studentshare_collection = db["studentShareUsers"]  #  Added Student Share Collection

# Route to process a new transaction
@app.route("/api/transactions", methods=["POST"])
def process_transaction():
    try:
        data = request.get_json()
        user_email = data.get("user_email")  #  Fetch user email from request
        user_name = data.get("user_name") 
        vehicle_id = data.get("vehicle_id")
        daily_rate = float(data.get("amount"))
        pickup = data.get("pickup")
        dropoff = data.get("dropoff")
        start = data.get("start")
        end = data.get("end")

        if not user_email or not user_name or not vehicle_id or not pickup or not dropoff or not start or not end:
            return jsonify({"error": "Missing required transaction details"}), 400

        #To calculate the total price
        start_date = datetime.strptime(start, "%Y-%m-%d")
        end_date = datetime.strptime(end, "%Y-%m-%d")
        days_rented = max(1, (end_date - start_date).days + 1)

        total_amount = daily_rate * days_rented
        #  Check if user is a Student Share member
        student_share_user = studentshare_collection.find_one({"email": user_email})
        if student_share_user:
            total_amount *= 0.85  # This Applies a 15% discount for Student Share members
            total_amount = round(total_amount, 2)  #  Round to 2 decimal places for consistency

        #  Fetch vehicle name from MongoDB
        vehicle = vehicles_collection.find_one({"carId": int(vehicle_id)})
        if not vehicle:
            return jsonify({"error": "Vehicle not found"}), 404

        vehicle_name = f"{vehicle['make']} {vehicle['model']}"

        #  Generate a unique transaction_id
        transaction_id = str(uuid.uuid4())

        # Create transaction record
        new_transaction = {
            "transaction_id": transaction_id,
            "user_email": user_email,  #  Store email for reference
            "user_name": user_name,
            "vehicle_id": vehicle_id,
            "vehicle_name": vehicle_name,
            "daily_rate" : daily_rate,
            "days_rented" : days_rented,
            "amount": total_amount,  #  Store correct (discounted) amount
            "pickup": pickup,
            "dropoff": dropoff,
            "start": start,
            "end": end,
            "status": "active",
            "created_at": datetime.utcnow()
        }

        #  Insert transaction into database
        transactions_collection.insert_one(new_transaction)

        return jsonify({
            "status": "success",
            "transaction_id": transaction_id,
            "daily_rate": daily_rate,
            "days_rented": days_rented,
            "amount": total_amount,
            "message": "Transaction created successfully"
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to fetch a transaction by ID
@app.route("/api/transactions/<string:transaction_id>", methods=["GET"])
def get_transaction(transaction_id):
    try:
        transaction = transactions_collection.find_one({"transaction_id": transaction_id}, {"_id": 0})
        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404
        return jsonify({"status": "success", "transaction": transaction}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask server
if __name__ == "__main__":
    app.run(debug=True, port=5000)
