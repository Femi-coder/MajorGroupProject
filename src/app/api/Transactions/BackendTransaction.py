from flask import Flask, request, jsonify, redirect, url_for
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
MONGO_URI = os.getenv("MONGODB_ATLAS_URI")
client = pymongo.MongoClient(MONGO_URI)
db = client.eco_wheels_db
rentals_collection = db.rentals
vehicles_collection = db.vehicles

# Initialize Transaction System
transaction_system = TransactionSystem()

class Rent(Resource):
    def get(self):
        """Handles car rentals (redirects to transactions page)."""
        name = request.args.get('name')
        car = request.args.get('car')
        amount = 50  # Example amount for rental

        if not name or not car:
            return {"error": "Missing required parameters"}, 400

        # Redirect user to the transactions page with rental details
        return redirect(url_for('process_transaction', user=name, car=car, amount=amount))

api.add_resource(Rent, '/rent')

class ProcessTransaction(Resource):
    def get(self):
        """Handles the transaction process."""
        user = request.args.get('user')
        car = request.args.get('car')
        amount = request.args.get('amount')

        if not user or not car or not amount:
            return {"error": "Missing transaction details"}, 400

        # Create a new transaction
        transaction_id = transaction_system.create_transaction(user, car, float(amount), TransactionType.RENTAL_PAYMENT)

        return {
            "status": "success",
            "transaction_id": transaction_id,
            "message": "Transaction completed successfully. You can now use the car!"
        }

api.add_resource(ProcessTransaction, '/transactions')

if __name__ == '__main__':
    app.run(debug=True)