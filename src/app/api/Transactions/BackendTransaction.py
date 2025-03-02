from flask import Flask, request, jsonify
from flask_restful import Resource, Api
import pymongo
from bson import ObjectId
import os
from dotenv import load_dotenv
from transaction import TransactionSystem, TransactionType

# Load environment variables
load_dotenv()

app = Flask(__name__)
api = Api(app)

# MongoDB Connection
MONGO_URI = os.getenv("MONGODB_ATLAS_URI", "mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net")
client = pymongo.MongoClient(MONGO_URI)
db = client["carrental"]
rentals_collection = db["rentals"]
vehicles_collection = db["vehicles"]

# Initialize Transaction System
transaction_system = TransactionSystem()

class Rent(Resource):
    def post(self):
        """Handles car rentals by creating a transaction for the rental."""
        data = request.get_json()
        user_id = data.get('user_id')
        rental_id = data.get('rental_id')
        amount = data.get('amount', 50)  # Default rental fee

        if not user_id or not rental_id:
            return jsonify({"error": "Missing required parameters"}), 400

        # Create a transaction for the rental
        transaction_id = transaction_system.create_transaction(user_id, rental_id, float(amount), TransactionType.RENTAL_PAYMENT)

        return jsonify({
            "status": "success",
            "transaction_id": transaction_id,
            "message": "Transaction created successfully"
        }), 201

api.add_resource(Rent, '/api/rent')

class ProcessTransaction(Resource):
    def get(self, transaction_id):
        """Fetch details of a transaction."""
        try:
            transaction = transaction_system.get_transaction(transaction_id)
            return jsonify({
                "status": "success",
                "transaction": transaction
            }), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 404

api.add_resource(ProcessTransaction, '/api/transactions/<string:transaction_id>')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
