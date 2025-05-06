# Importing necessary libraries
from flask import Flask, request, jsonify  # Flask for web framework, request for handling incoming data, jsonify for returning JSON responses
from flask_cors import CORS  # CORS for enabling cross-origin requests
import pymongo  # MongoDB driver for connecting and querying MongoDB
import os  # os for accessing environment variables
import uuid  # uuid for generating unique transaction IDs
from datetime import datetime  # datetime for getting the current UTC time
from dotenv import load_dotenv  # dotenv for loading environment variables from a .env file

# Load environment variables from the .env file
load_dotenv()

# Initialize Flask App
app = Flask(__name__)  # Initialize Flask web app
CORS(app)  # Enable cross-origin resource sharing (CORS) for the app

# MongoDB Configuration: MongoDB URI is loaded from environment variables or falls back to a default string
MONGO_URI = os.getenv("MONGODB_ATLAS_URI", "mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net")
client = pymongo.MongoClient(MONGO_URI)  # Connect to MongoDB using the URI
db = client["carrental"]  # Access the "carrental" database
transactions_collection = db["transactions"]  # Access the "transactions" collection
vehicles_collection = db["vehicles"]  # Access the "vehicles" collection
studentshare_collection = db["studentShareUsers"]  # Access the "studentShareUsers" collection (for student discount)

# Route to process a new transaction (POST request)
@app.route("/api/transactions", methods=["POST"])
def process_transaction():
    try:
        # Get the transaction data from the incoming JSON request
        data = request.get_json()
        user_email = data.get("user_email")  # User's email address
        user_name = data.get("user_name")  # User's name
        vehicle_id = data.get("vehicle_id")  # Vehicle ID for the transaction
        amount = float(data.get("amount"))  # Amount for the transaction (convert to float)
        pickup = data.get("pickup")  # Pickup location
        dropoff = data.get("dropoff")  # Dropoff location
        start = data.get("start")  # Start date/time of the rental
        end = data.get("end")  # End date/time of the rental

        # Ensure all required fields are provided
        if not user_email or not user_name or not vehicle_id or not pickup or not dropoff or not start or not end:
            return jsonify({"error": "Missing required transaction details"}), 400

        # Check if the user is part of the Student Share program (to apply discount)
        student_share_user = studentshare_collection.find_one({"email": user_email})
        if student_share_user:
            amount *= 0.85  # Apply a 15% discount for Student Share members
            amount = round(amount, 2)  # Round the discounted amount to two decimal places for consistency

        # Fetch the vehicle details from MongoDB using the vehicle ID
        vehicle = vehicles_collection.find_one({"carId": int(vehicle_id)})
        if not vehicle:
            return jsonify({"error": "Vehicle not found"}), 404  # Return error if the vehicle is not found

        # Get the vehicle's name (make and model)
        vehicle_name = f"{vehicle['make']} {vehicle['model']}"

        # Generate a unique transaction ID using UUID
        transaction_id = str(uuid.uuid4())

        # Create a new transaction record
        new_transaction = {
            "transaction_id": transaction_id,  # Unique transaction ID
            "user_email": user_email,  # Store the user's email for reference
            "user_name": user_name,  # Store the user's name
            "vehicle_id": vehicle_id,  # Vehicle ID for the transaction
            "vehicle_name": vehicle_name,  # Vehicle's make and model
            "amount": amount,  # Store the amount (discounted if applicable)
            "pickup": pickup,  # Pickup location
            "dropoff": dropoff,  # Dropoff location
            "start": start,  # Start time of the rental
            "end": end,  # End time of the rental
            "status": "active",  # Set the transaction status to active
            "created_at": datetime.utcnow()  # Store the creation time in UTC
        }

        # Insert the new transaction into the transactions collection
        transactions_collection.insert_one(new_transaction)

        # Return a success response with the transaction ID and final price
        return jsonify({
            "status": "success",
            "transaction_id": transaction_id,
            "final_price": amount,  # Send the final price (after discount) in the response
            "message": "Transaction created successfully"
        }), 201  # HTTP status code for created

    except Exception as e:
        # Return an error response if an exception occurs
        return jsonify({"error": str(e)}), 500  # HTTP status code for internal server error

# Route to fetch a transaction by its ID (GET request)
@app.route("/api/transactions/<string:transaction_id>", methods=["GET"])
def get_transaction(transaction_id):
    try:
        # Fetch the transaction from the database using the transaction ID
        transaction = transactions_collection.find_one({"transaction_id": transaction_id}, {"_id": 0})
        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404  # Return error if the transaction is not found
        return jsonify({"status": "success", "transaction": transaction}), 200  # Return the transaction details

    except Exception as e:
        # Return an error response if an exception occurs
        return jsonify({"error": str(e)}), 500  # HTTP status code for internal server error

# Route to fetch all transactions (GET request)
@app.route("/api/transactions", methods=["GET"])
def get_all_transactions():
    try:
        # Fetch all transactions from the database
        transactions = list(transactions_collection.find({}, {"_id": 0}))  # Exclude the _id field
        return jsonify(transactions), 200  # Return the list of transactions

    except Exception as e:
        # Return an error response if an exception occurs
        return jsonify({"error": str(e)}), 500  # HTTP status code for internal server error

# Run the Flask server
if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Start the Flask app in debug mode on port 5000
