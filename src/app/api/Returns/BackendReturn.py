from flask import Flask, request, jsonify
from flask_restful import Resource, Api
import logging
from datetime import datetime, timedelta
import pymongo
from bson import ObjectId
import os

app = Flask(__name__)
api = Api(app)

# Configure Logging
logging.basicConfig(level=logging.INFO)

# Connect to MongoDB
MONGO_URI = os.getenv("MONGODB_ATLAS_URI")  # Store in environment variable
client = pymongo.MongoClient(MONGO_URI)
db = client.eco_wheels_db
rentals_collection = db.rentals
vehicles_collection = db.vehicles
transactions_collection = db.transactions

# Rental Return Logic
class ReturnCar(Resource):
    def post(self):
        """Handles returning a rental car."""
        data = request.get_json()
        rental_id = data.get("rental_id")

        if not rental_id:
            return jsonify({"status": "error", "message": "Missing rental_id"}), 400

        rental = rentals_collection.find_one({"_id": ObjectId(rental_id)})

        if not rental:
            return jsonify({"status": "error", "message": "Rental not found"}), 404

        if rental.get("status") == "returned":
            return jsonify({"status": "error", "message": "Car already returned"}), 400

        # Calculate late fee if applicable
        due_date = rental.get("due_date")  # Assume stored as datetime in DB
        return_time = datetime.utcnow()
        late_fee = 0

        if return_time > due_date:
            late_days = (return_time - due_date).days
            late_fee = late_days * 20  # Charge €20 per late day

        # Update rental status in DB
        rentals_collection.update_one(
            {"_id": ObjectId(rental_id)},
            {
                "$set": {
                    "status": "returned",
                    "return_time": return_time,
                    "late_fee": late_fee
                }
            }
        )

        # Process late fee transaction
        if late_fee > 0:
            transaction = {
                "user_id": rental["user_id"],
                "rental_id": rental_id,
                "amount": late_fee,
                "type": "late_fee",
                "status": "pending",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            transactions_collection.insert_one(transaction)

        # Make vehicle available again
        vehicles_collection.update_one(
            {"_id": ObjectId(rental["vehicle_id"])},
            {"$set": {"available": True}}
        )

        return {
            "status": "success",
            "message": "Car returned successfully",
            "late_fee": late_fee
        }

# Add to API Routes
api.add_resource(ReturnCar, "/return-car")

if __name__ == '__main__':
    app.run(debug=True)